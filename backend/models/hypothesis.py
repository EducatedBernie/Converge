from typing import Optional

from sqlalchemy import Integer, String, Float, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class Hypothesis(Base):
    __tablename__ = "hypotheses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    run_id: Mapped[int] = mapped_column(Integer, ForeignKey("simulation_runs.id"), nullable=False)
    step_id: Mapped[int] = mapped_column(Integer, ForeignKey("funnel_steps.id"), nullable=False)
    trigger_user_count: Mapped[int] = mapped_column(Integer, nullable=False)
    analysis: Mapped[str] = mapped_column(String, nullable=False)
    hypothesis_text: Mapped[str] = mapped_column(String, nullable=False)
    confidence: Mapped[float] = mapped_column(Float, nullable=False)
    generated_variant_ids: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    outcome: Mapped[Optional[str]] = mapped_column(String, nullable=True)
