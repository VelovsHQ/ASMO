from dataclasses import dataclass

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.ai_analysis import AIAnalysis
from app.models.article import Article
from app.models.prediction import Prediction


@dataclass
class HistoricalCase:
    article: Article
    analysis: AIAnalysis | None
    predictions: list[Prediction]


class HistoryService:

    @staticmethod
    def build_cases(
        db: Session,
        articles: list[Article],
    ) -> list[HistoricalCase]:

        cases = []

        for article in articles:

            analysis = db.scalar(
                select(AIAnalysis)
                .where(AIAnalysis.article_id == article.id)
            )

            predictions = list(
                db.scalars(
                    select(Prediction)
                    .options(selectinload(Prediction.market))
                    .where(Prediction.analysis_id == analysis.id)
                )
            ) if analysis else []

            cases.append(
                HistoricalCase(
                    article=article,
                    analysis=analysis,
                    predictions=predictions,
                )
            )

        return cases

    @staticmethod
    def build_context(
        cases: list[HistoricalCase],
    ) -> str:

        context = []

        for case in cases:

            text = f"""
=================================================
Historical Article

Title:
{case.article.title}

Content:
{case.article.content[:1200]}
"""

            if case.analysis:

                text += f"""

Summary:
{case.analysis.summary}

Event Type:
{case.analysis.event_type}

Sentiment:
{case.analysis.sentiment}

Confidence:
{case.analysis.confidence}
"""

            if case.predictions:

                text += "\nPredictions:\n"

                for prediction in case.predictions:

                    text += f"""
- {prediction.market.name}
  Direction: {prediction.direction}
  Confidence: {prediction.confidence}
  Reason:
  {prediction.explanation}
"""

            context.append(text)

        return "\n\n".join(context)