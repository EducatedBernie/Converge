from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sse_starlette.sse import EventSourceResponse

from database import get_db
from config import DEFAULT_TOTAL_USERS, DEFAULT_POPULATION_MIX, DEFAULT_AGENT_TRIGGER_INTERVAL
from models.simulation_run import SimulationRun
from engine.simulation import run_simulation, get_run_state

router = APIRouter(prefix="/api/simulation", tags=["simulation"])


class StartRequest(BaseModel):
    total_users: int = DEFAULT_TOTAL_USERS
    population_mix: dict = DEFAULT_POPULATION_MIX
    agent_trigger_interval: int = DEFAULT_AGENT_TRIGGER_INTERVAL


class SpeedRequest(BaseModel):
    speed: int


class PopulationMixRequest(BaseModel):
    population_mix: dict


@router.post("/start")
def start_simulation(req: StartRequest, db: Session = Depends(get_db)):
    run = SimulationRun(
        status="pending",
        total_users=req.total_users,
        population_mix=req.population_mix,
        agent_trigger_interval=req.agent_trigger_interval,
    )
    db.add(run)
    db.commit()
    db.refresh(run)
    return {"run_id": run.id, "status": run.status}


@router.get("/{run_id}/stream")
async def stream_simulation(run_id: int):
    return EventSourceResponse(run_simulation(run_id))


@router.post("/{run_id}/pause")
def pause_simulation(run_id: int):
    state = get_run_state(run_id)
    if not state:
        return {"error": "Run not active"}
    state["paused"] = True
    return {"status": "paused"}


@router.post("/{run_id}/resume")
def resume_simulation(run_id: int):
    state = get_run_state(run_id)
    if not state:
        return {"error": "Run not active"}
    state["paused"] = False
    return {"status": "running"}


@router.post("/{run_id}/stop")
def stop_simulation(run_id: int):
    state = get_run_state(run_id)
    if not state:
        return {"error": "Run not active"}
    state["stopped"] = True
    return {"status": "stopping"}


@router.patch("/{run_id}/speed")
def set_speed(run_id: int, req: SpeedRequest):
    state = get_run_state(run_id)
    if not state:
        return {"error": "Run not active"}
    state["speed"] = max(1, req.speed)
    return {"speed": state["speed"]}


@router.patch("/{run_id}/population")
def set_population_mix(run_id: int, req: PopulationMixRequest, db: Session = Depends(get_db)):
    run = db.query(SimulationRun).get(run_id)
    if not run:
        return {"error": "Run not found"}
    run.population_mix = req.population_mix
    db.commit()
    return {"population_mix": run.population_mix}
