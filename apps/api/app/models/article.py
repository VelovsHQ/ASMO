from sqlalchemy import String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

from app.db.base import Base
from sqlalchemy.sql import func


class Article(Base):
    __tablename__ = "articles"

    id: Mapped[int] = mapped_column(primary_key=True)

    title: Mapped[str] = mapped_column(String(500), nullable=False)

    content: Mapped[str] = mapped_column(Text, nullable=False)

    source: Mapped[str] = mapped_column(String(255), nullable=False)

    url: Mapped[str] = mapped_column(String(1000), unique=True, nullable=False)

    published_at: Mapped[datetime] = mapped_column(DateTime)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )