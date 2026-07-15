from app.db.session import SessionLocal
from app.services.article_service import ArticleService
from app.services.embedding_service import EmbeddingService
from app.services.article_embedding_service import (
    ArticleEmbeddingService,
)

db = SessionLocal()

try:

    article = ArticleService.get_by_id(db, 1)

    embedding = EmbeddingService.generate_embedding(
        article.content
    )

    similar = ArticleEmbeddingService.find_similar(
        db=db,
        embedding=embedding,
        limit=5,
    )

    print()

    print("=" * 50)
    print("TOP 5 SIMILAR ARTICLES")
    print("=" * 50)

    for item in similar:

        print(
            f"Article ID: {item.article_id}"
        )

finally:

    db.close()