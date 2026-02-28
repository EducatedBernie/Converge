from sqlalchemy import Integer, Float, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    run_id: Mapped[int] = mapped_column(Integer, ForeignKey("simulation_runs.id"), nullable=False)
    user_number: Mapped[int] = mapped_column(Integer, nullable=False)
    persona_id: Mapped[int] = mapped_column(Integer, ForeignKey("personas.id"), nullable=False)
    step_id: Mapped[int] = mapped_column(Integer, ForeignKey("funnel_steps.id"), nullable=False)
    variant_id: Mapped[int] = mapped_column(Integer, ForeignKey("variants.id"), nullable=False)
    converted: Mapped[bool] = mapped_column(Boolean, nullable=False)
    match_score: Mapped[float] = mapped_column(Float, nullable=False)
