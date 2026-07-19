from typing import TypedDict

from app.models.article import Article


class PipelineState(TypedDict):

    article_id: int
    article: Article

    embedding: list[float]

    history: str

    analysis: dict

    predictions: list