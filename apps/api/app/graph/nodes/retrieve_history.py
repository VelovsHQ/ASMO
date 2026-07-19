from app.db.session import SessionLocal
from app.services.article_embedding_service import (
    ArticleEmbeddingService,
)
from app.services.history_service import HistoryService


def retrieve_history(state):

    db = SessionLocal()

    try:

        similar = (
            ArticleEmbeddingService.find_similar(
                db=db,
                embedding=state["embedding"],
                limit=5,
            )
        )

        articles = (
            ArticleEmbeddingService.get_articles_from_embeddings(
                db=db,
                embeddings=similar,
            )
        )

        historical_articles = HistoryService.build_cases(
            db=db,
            articles=articles,
        )

        state["historical_articles"] = historical_articles

        print("✅ Historical Context Built")

        return state

    finally:

        db.close()