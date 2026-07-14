from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id: Mapped[int] = mapped_column(primary_key=True)

    analysis_id: Mapped[int] = mapped_column(
        ForeignKey("ai_analyses.id", ondelete="CASCADE"),
        nullable=False,
    )

    market_id: Mapped[int] = mapped_column(
        ForeignKey("markets.id", ondelete="CASCADE"),
        nullable=False,
    )

    direction: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    impact_min: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    impact_max: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    confidence: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    timeframe: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    explanation: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    analysis = relationship(
        "AIAnalysis",
        back_populates="predictions",
    )

    market = relationship(
        "Market",
        back_populates="predictions",
    )