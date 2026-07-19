from typing import Any, TypedDict

from app.models.article import Article


class PipelineState(TypedDict):

    article_id: int
    article: Article

    db: Any

    embedding: list[float]

    historical_articles: list[Article]

    history: str

    analysis: dict

    predictions: list