from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.services.article_service import ArticleService

router = APIRouter(
    prefix="/articles",
    tags=["Articles"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_articles(
    db: Session = Depends(get_db),
):

    articles = ArticleService.get_all(db)

    return {
        "count": len(articles),
        "data": articles,
    }


@router.get("/latest")
def latest_articles(
    limit: int = 10,
    db: Session = Depends(get_db),
):

    articles = ArticleService.get_latest(
        db,
        limit,
    )

    return {
        "count": len(articles),
        "data": articles,
    }


@router.get("/{article_id}")
def get_article(
    article_id: int,
    db: Session = Depends(get_db),
):

    article = ArticleService.get_by_id(
        db,
        article_id,
    )

    if article is None:
        raise HTTPException(
            status_code=404,
            detail="Article not found",
        )

    return article