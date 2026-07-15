from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.article_embedding import ArticleEmbedding


class ArticleEmbeddingService:

    @staticmethod
    def create(
        db: Session,
        article_id: int,
        embedding: list[float],
        model_name: str,
    ):

        record = ArticleEmbedding(
            article_id=article_id,
            embedding=embedding,
            model_name=model_name,
            dimensions=len(embedding),
        )

        db.add(record)

        db.flush()

        return record

    @staticmethod
    def exists(
        db: Session,
        article_id: int,
    ):

        return db.scalar(
            select(ArticleEmbedding).where(
                ArticleEmbedding.article_id == article_id
            )
        )