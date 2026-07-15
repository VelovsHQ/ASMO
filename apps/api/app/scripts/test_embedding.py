from app.services.embedding_service import EmbeddingService


embedding = EmbeddingService.generate_embedding(
    "Apple stock rises after strong quarterly earnings."
)

print(len(embedding))

print(embedding[:10])