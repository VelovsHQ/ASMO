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

    @staticmethod
    def find_similar(
        db: Session,
        embedding: list[float],
        limit: int = 5,
    ):

        return list(
            db.scalars(
                select(ArticleEmbedding)
                .order_by(
                    ArticleEmbedding.embedding.cosine_distance(embedding)
                )
                .limit(limit)
            )
        )

    @staticmethod
    def get_articles_from_embeddings(
        db: Session,
        embeddings: list[ArticleEmbedding],
    ):

        from app.models.article import Article

        ids = [e.article_id for e in embeddings]

        return list(
            db.scalars(
                select(Article)
                .where(Article.id.in_(ids))
            )
        )