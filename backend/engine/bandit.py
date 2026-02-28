import numpy as np
from sqlalchemy.orm import Session

from models.bandit_state import BanditState


def thompson_select(db: Session, step_id: int) -> int:
    """Select a variant for the given step using Thompson Sampling.
    Returns the variant_id with the highest sampled value."""
    from models.variant import Variant

    active_variants = (
        db.query(Variant).filter(Variant.step_id == step_id, Variant.is_active == True).all()
    )
    variant_ids = [v.id for v in active_variants]

    states = db.query(BanditState).filter(BanditState.variant_id.in_(variant_ids)).all()

    best_variant_id = None
    best_sample = -1.0

    for state in states:
        sample = np.random.beta(state.alpha, state.beta_param)
        if sample > best_sample:
            best_sample = sample
            best_variant_id = state.variant_id

    return best_variant_id


def update_bandit(db: Session, variant_id: int, converted: bool) -> None:
    """Update the bandit state for a variant after an observation."""
    state = db.query(BanditState).filter(BanditState.variant_id == variant_id).one()
    state.exposures += 1
    if converted:
        state.alpha += 1
        state.conversions += 1
    else:
        state.beta_param += 1
    state.rate = state.conversions / state.exposures if state.exposures > 0 else 0.0
    db.flush()
