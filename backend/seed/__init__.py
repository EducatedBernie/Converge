from database import SessionLocal
from models.persona import Persona
from models.funnel_step import FunnelStep
from models.variant import Variant
from models.bandit_state import BanditState
from seed.personas import PERSONAS
from seed.funnel_steps import FUNNEL_STEPS
from seed.variants import VARIANTS


def seed_database():
    db = SessionLocal()
    try:
        if db.query(Persona).count() > 0:
            return  # already seeded

        # Personas
        for p in PERSONAS:
            db.add(Persona(name=p["name"], description=p["description"], preferences=p["preferences"]))
        db.flush()

        # Funnel steps
        for s in FUNNEL_STEPS:
            db.add(FunnelStep(step_number=s["step_number"], name=s["name"], description=s["description"]))
        db.flush()

        # Variants + bandit states
        step_map = {s.step_number: s.id for s in db.query(FunnelStep).all()}
        for v in VARIANTS:
            variant = Variant(
                step_id=step_map[v["step_number"]],
                generation=v["generation"],
                content=v["content"],
                features=v["features"],
            )
            db.add(variant)
            db.flush()
            db.add(BanditState(variant_id=variant.id))

        db.commit()
    finally:
        db.close()
