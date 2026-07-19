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

        cases = HistoryService.build_cases(
            db=db,
            articles=articles,
        )

        history = HistoryService.build_context(
            cases,
        )

        state["history"] = history

        print("✅ Historical Context Built")

        return state

    finally:

        db.close()