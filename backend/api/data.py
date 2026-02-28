from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models.event import Event
from models.variant import Variant
from models.bandit_state import BanditState
from models.funnel_step import FunnelStep
from models.persona import Persona

router = APIRouter(prefix="/api/data", tags=["data"])


@router.get("/stats")
def get_stats(run_id: Optional[int] = None, db: Session = Depends(get_db)):
    """Per-step, per-variant conversion rates."""
    steps = db.query(FunnelStep).order_by(FunnelStep.step_number).all()
    result = []
    for step in steps:
        variants = db.query(Variant).filter(Variant.step_id == step.id).all()
        variant_stats = []
        for v in variants:
            bs = db.query(BanditState).filter(BanditState.variant_id == v.id).first()
            variant_stats.append({
                "variant_id": v.id,
                "generation": v.generation,
                "content": v.content,
                "features": v.features,
                "is_active": v.is_active,
                "exposures": bs.exposures if bs else 0,
                "conversions": bs.conversions if bs else 0,
                "rate": round(bs.rate, 4) if bs else 0.0,
                "alpha": bs.alpha if bs else 1.0,
                "beta": bs.beta_param if bs else 1.0,
            })
        result.append({
            "step_id": step.id,
            "step_number": step.step_number,
            "step_name": step.name,
            "variants": variant_stats,
        })
    return result


@router.get("/events")
def get_events(
    run_id: int,
    offset: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
):
    """Paginated event log."""
    events = (
        db.query(Event)
        .filter(Event.run_id == run_id)
        .order_by(Event.id.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    total = db.query(func.count(Event.id)).filter(Event.run_id == run_id).scalar()
    return {
        "total": total,
        "offset": offset,
        "limit": limit,
        "events": [
            {
                "id": e.id,
                "user_number": e.user_number,
                "persona_id": e.persona_id,
                "step_id": e.step_id,
                "variant_id": e.variant_id,
                "converted": e.converted,
                "match_score": round(e.match_score, 3),
            }
            for e in events
        ],
    }


@router.get("/variants")
def get_variants(step_id: Optional[int] = None, db: Session = Depends(get_db)):
    """Get variants, optionally filtered by step."""
    query = db.query(Variant)
    if step_id:
        query = query.filter(Variant.step_id == step_id)
    variants = query.all()
    return [
        {
            "id": v.id,
            "step_id": v.step_id,
            "generation": v.generation,
            "content": v.content,
            "features": v.features,
            "is_active": v.is_active,
        }
        for v in variants
    ]


@router.get("/personas")
def get_personas(db: Session = Depends(get_db)):
    personas = db.query(Persona).all()
    return [
        {"id": p.id, "name": p.name, "description": p.description, "preferences": p.preferences}
        for p in personas
    ]
