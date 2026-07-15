from sqlalchemy import select

from app.db.session import SessionLocal
from app.models.article import Article
from app.services.article_embedding_service import (
    ArticleEmbeddingService,
)
from app.services.embedding_service import EmbeddingService


MODEL_NAME = "gemini-embedding-001"


db = SessionLocal()

try:

    articles = list(
        db.scalars(
            select(Article)
        )
    )

    print(f"\nFound {len(articles)} articles\n")

    embedded = 0
    skipped = 0

    for article in articles:

        exists = ArticleEmbeddingService.exists(
            db,
            article.id,
        )

        if exists:

            skipped += 1
            print(f"⏭️  Skipping Article {article.id}")

            continue

        print(f"🧠 Embedding Article {article.id}")

        embedding = EmbeddingService.generate_embedding(
            article.content
        )

        ArticleEmbeddingService.create(
            db=db,
            article_id=article.id,
            embedding=embedding,
            model_name=MODEL_NAME,
        )

        embedded += 1

    db.commit()

    print("\n")
    print("=" * 50)
    print("Embedding Complete")
    print("=" * 50)
    print(f"Embedded : {embedded}")
    print(f"Skipped  : {skipped}")
    print("=" * 50)

except Exception:

    db.rollback()
    raise

finally:

    db.close()