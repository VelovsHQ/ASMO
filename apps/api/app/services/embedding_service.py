from openai import OpenAI

from app.core.config import settings

client = OpenAI(
    api_key=settings.GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1",
)


class EmbeddingService:

    @staticmethod
    def generate_embedding(text: str):
        raise NotImplementedError("Coming next step")