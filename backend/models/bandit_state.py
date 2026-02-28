from sqlalchemy import Integer, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class BanditState(Base):
    __tablename__ = "bandit_states"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    variant_id: Mapped[int] = mapped_column(Integer, ForeignKey("variants.id"), unique=True, nullable=False)
    alpha: Mapped[float] = mapped_column(Float, nullable=False, default=1.0)
    beta_param: Mapped[float] = mapped_column(Float, nullable=False, default=1.0)
    exposures: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    conversions: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    rate: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
