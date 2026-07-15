from datetime import datetime

from pgvector.sqlalchemy import Vector
from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.db.base import Base


class ArticleEmbedding(Base):
    __tablename__ = "article_embeddings"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    article_id: Mapped[int] = mapped_column(
        ForeignKey("articles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    model_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    dimensions: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    embedding: Mapped[list[float]] = mapped_column(
        Vector(3072),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )