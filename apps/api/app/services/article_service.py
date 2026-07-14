from sqlalchemy import select

from app.db.session import SessionLocal
from app.models.article import Article


class ArticleService:

    @staticmethod
    def exists(url: str) -> bool:
        db = SessionLocal()

        article = db.scalar(
            select(Article).where(Article.url == url)
        )

        db.close()

        return article is not None

    @staticmethod
    def create(**kwargs):

        db = SessionLocal()

        article = Article(**kwargs)

        db.add(article)

        db.commit()

        db.refresh(article)

        db.close()

        return article