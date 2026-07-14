from sqlalchemy import select

from app.db.session import SessionLocal

from app.models.article import Article
from app.models.market import Market

from app.services.ai_service import (
    analyze_article,
    predict_markets,
)

from app.services.analysis_service import AnalysisService
from app.services.prediction_service import PredictionService


class PipelineService:

    @staticmethod
    def process_article(article_id: int):

        db = SessionLocal()

        article = db.scalar(
            select(Article).where(
                Article.id == article_id
            )
        )

        if article is None:
            db.close()
            raise Exception("Article not found")

        analysis_result = analyze_article(
            article.title,
            article.content,
        )

        analysis = AnalysisService.create(
            article_id=article.id,
            summary=analysis_result["summary"],
            event_type=analysis_result["event_type"],
            sentiment=analysis_result["sentiment"],
            reasoning=analysis_result["reasoning"],
            confidence=analysis_result["confidence"],
            model_name="llama-3.3-70b-versatile",
        )

        prediction_result = predict_markets(
            article.title,
            article.content,
        )

        created_predictions = []

        for item in prediction_result["predictions"]:

            market = db.scalar(
                select(Market).where(
                    Market.name == item["market"]
                )
            )

            if market is None:
                continue

            prediction = PredictionService.create(
                analysis_id=analysis.id,
                market_id=market.id,
                direction=item["direction"],
                impact_min=item["impact_min"],
                impact_max=item["impact_max"],
                confidence=item["confidence"],
                timeframe=item["timeframe"],
                explanation=item["explanation"],
            )

            created_predictions.append(prediction)

        db.close()

        return {
            "article": article.id,
            "analysis": analysis.id,
            "predictions": len(created_predictions),
        }