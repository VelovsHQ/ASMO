from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.article import Article
from app.models.prediction import Prediction


class DashboardService:

    @staticmethod
    def get_dashboard(db: Session):

        latest_articles = list(
            db.scalars(
                select(Article)
                .order_by(Article.published_at.desc())
                .limit(5)
            )
        )

        latest_predictions = list(
            db.scalars(
                select(Prediction)
                .order_by(Prediction.created_at.desc())
                .limit(10)
            )
        )

        total_articles = db.scalar(
            select(func.count()).select_from(Article)
        )

        total_predictions = db.scalar(
            select(func.count()).select_from(Prediction)
        )

        bullish = db.scalar(
            select(func.count())
            .select_from(Prediction)
            .where(Prediction.direction == "Bullish")
        )

        bearish = db.scalar(
            select(func.count())
            .select_from(Prediction)
            .where(Prediction.direction == "Bearish")
        )

        neutral = db.scalar(
            select(func.count())
            .select_from(Prediction)
            .where(Prediction.direction == "Neutral")
        )

        return {
            "latest_articles": latest_articles,
            "latest_predictions": latest_predictions,
            "market_summary": {
                "bullish": bullish,
                "bearish": bearish,
                "neutral": neutral,
            },
            "total_articles": total_articles,
            "total_predictions": total_predictions,
        }