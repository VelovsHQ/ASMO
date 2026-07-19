from app.db.session import SessionLocal
from app.services.article_service import ArticleService


def load_article(state):

    db = SessionLocal()
    state["db"] = db

    try:

        article = ArticleService.get_by_id(
            db,
            state["article_id"],
        )

        state["article"] = article

        return state

    finally:
        pass