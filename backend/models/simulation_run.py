from sqlalchemy import Integer, String, JSON
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class SimulationRun(Base):
    __tablename__ = "simulation_runs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    status: Mapped[str] = mapped_column(String, nullable=False, default="pending")
    total_users: Mapped[int] = mapped_column(Integer, nullable=False, default=500)
    population_mix: Mapped[dict] = mapped_column(JSON, nullable=False)
    agent_trigger_interval: Mapped[int] = mapped_column(Integer, nullable=False, default=100)
