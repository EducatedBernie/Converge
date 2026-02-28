import asyncio
import json
import random
from typing import AsyncGenerator, Dict, List

from sqlalchemy.orm import Session

from database import SessionLocal
from models.persona import Persona
from models.funnel_step import FunnelStep
from models.variant import Variant
from models.event import Event
from models.simulation_run import SimulationRun
from engine.bandit import thompson_select, update_bandit
from engine.conversion import simulate_conversion_with_matrix
from engine.scorer import generate_conversion_matrix


# Global simulation state per run
_active_runs: Dict[int, dict] = {}


def get_run_state(run_id: int):
    return _active_runs.get(run_id)


def _sample_persona(db: Session, population_mix: dict) -> Persona:
    """Sample a persona according to the population mix weights."""
    personas = db.query(Persona).all()
    names = [p.name for p in personas]
    weights = [population_mix.get(p.name, 0.2) for p in personas]
    total = sum(weights)
    weights = [w / total for w in weights]
    chosen_name = random.choices(names, weights=weights, k=1)[0]
    return next(p for p in personas if p.name == chosen_name)


def simulate_user(db: Session, run: SimulationRun, user_number: int, matrix: dict) -> List[dict]:
    """Simulate one user walking through the funnel using Claude-scored matrix."""
    steps = db.query(FunnelStep).order_by(FunnelStep.step_number).all()
    persona = _sample_persona(db, run.population_mix)
    events = []

    for step in steps:
        variant_id = thompson_select(db, step.id)
        if variant_id is None:
            break

        converted, match_score = simulate_conversion_with_matrix(
            persona.name, variant_id, matrix
        )
        update_bandit(db, variant_id, converted)

        event = Event(
            run_id=run.id,
            user_number=user_number,
            persona_id=persona.id,
            step_id=step.id,
            variant_id=variant_id,
            converted=converted,
            match_score=match_score,
        )
        db.add(event)

        events.append({
            "type": "user_event",
            "user_number": user_number,
            "persona": persona.name,
            "step": step.step_number,
            "step_name": step.name,
            "variant_id": variant_id,
            "converted": converted,
            "match_score": round(match_score, 3),
        })

        if not converted:
            break  # user dropped off

    db.commit()
    return events


async def run_simulation(run_id: int) -> AsyncGenerator[dict, None]:
    """Main simulation loop. Yields dicts — sse-starlette handles framing."""
    db = SessionLocal()
    try:
        run = db.query(SimulationRun).get(run_id)
        if not run:
            yield {"data": json.dumps({"type": "error", "message": "Run not found"})}
            return

        run.status = "running"
        db.commit()

        # Generate conversion matrix via Claude (one API call)
        personas = db.query(Persona).all()
        steps = db.query(FunnelStep).order_by(FunnelStep.step_number).all()
        variants = db.query(Variant).filter(Variant.is_active == True).all()

        yield {"data": json.dumps({"type": "status", "message": "Generating conversion matrix via Claude..."})}

        matrix = generate_conversion_matrix(personas, steps, variants)

        yield {"data": json.dumps({
            "type": "matrix_ready",
            "pairs": len(matrix),
            "sample": [
                {"persona": k[0], "variant_id": k[1], "prob": round(v, 3)}
                for k, v in list(matrix.items())[:6]
            ],
        })}

        state = {"paused": False, "stopped": False, "speed": 5, "matrix": matrix}
        _active_runs[run_id] = state

        yield {"data": json.dumps({"type": "sim_started", "run_id": run_id})}

        user_number = 0
        while user_number < run.total_users:
            if state["stopped"]:
                break

            if state["paused"]:
                await asyncio.sleep(0.1)
                continue

            user_number += 1

            # Refresh run to pick up population_mix changes
            db.refresh(run)

            events = simulate_user(db, run, user_number, matrix)
            for event_data in events:
                yield {"data": json.dumps(event_data)}

            # Yield bandit state snapshot every user
            from models.bandit_state import BanditState
            bandit_states = db.query(BanditState).all()
            snapshot = {
                "type": "bandit_snapshot",
                "user_number": user_number,
                "states": [
                    {
                        "variant_id": bs.variant_id,
                        "alpha": bs.alpha,
                        "beta": bs.beta_param,
                        "exposures": bs.exposures,
                        "conversions": bs.conversions,
                        "rate": round(bs.rate, 4),
                    }
                    for bs in bandit_states
                ],
            }
            yield {"data": json.dumps(snapshot)}

            # Throttle based on speed
            delay = 1.0 / state["speed"] if state["speed"] > 0 else 0.2
            await asyncio.sleep(delay)

        run.status = "stopped" if state["stopped"] else "completed"
        db.commit()

        yield {"data": json.dumps({"type": "sim_ended", "run_id": run_id, "total_users": user_number})}

    finally:
        _active_runs.pop(run_id, None)
        db.close()
