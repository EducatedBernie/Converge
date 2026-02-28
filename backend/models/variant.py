from sqlalchemy import Integer, ForeignKey, JSON, Boolean
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class Variant(Base):
    __tablename__ = "variants"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    step_id: Mapped[int] = mapped_column(Integer, ForeignKey("funnel_steps.id"), nullable=False)
    generation: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    content: Mapped[dict] = mapped_column(JSON, nullable=False)
    features: Mapped[dict] = mapped_column(JSON, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
