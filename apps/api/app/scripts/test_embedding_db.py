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

    ArticleEmbeddingService.create(
        db=db,
        article_id=article.id,
        embedding=embedding,
        model_name="gemini-embedding-001",
    )

    db.commit()

    print("✅ Embedding stored successfully!")

finally:

    db.close()