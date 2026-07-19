from app.services.embedding_service import EmbeddingService


def generate_embedding(state):

    article = state["article"]

    embedding = EmbeddingService.generate_embedding(
        article.content
    )

    state["embedding"] = embedding

    print("✅ Embedding Generated")

    return state