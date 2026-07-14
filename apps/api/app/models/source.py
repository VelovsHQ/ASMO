from datetime import datetime

from sqlalchemy import String, Boolean, Integer, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from sqlalchemy.sql import func


class Source(Base):
    __tablename__ = "sources"

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    website_url: Mapped[str] = mapped_column(String(500), nullable=False)

    rss_url: Mapped[str] = mapped_column(String(500), nullable=True)

    country: Mapped[str] = mapped_column(String(100), nullable=False)

    language: Mapped[str] = mapped_column(String(20), nullable=False)

    credibility_score: Mapped[int] = mapped_column(Integer, default=100)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )