from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.article import Article


class ArticleService:

    @staticmethod
    def get_by_id(db: Session, article_id: int):

        return db.scalar(
            select(Article)
            .where(Article.id == article_id)
        )

    @staticmethod
    def get_latest(db: Session, limit: int = 10):

        return list(
            db.scalars(
                select(Article)
                .order_by(Article.published_at.desc())
                .limit(limit)
            )
        )

    @staticmethod
    def get_all(db: Session):

        return list(
            db.scalars(
                select(Article)
                .order_by(Article.published_at.desc())
            )
        )

    @staticmethod
    def exists(db: Session, url: str):

        article = db.scalar(
            select(Article)
            .where(Article.url == url)
        )

        return article is not None

    @staticmethod
    def create(db: Session, **kwargs):

        article = Article(**kwargs)

        db.add(article)

        db.flush()

        return article