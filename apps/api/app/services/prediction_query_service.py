from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.ai_analysis import AIAnalysis
from app.models.prediction import Prediction


class PredictionQueryService:

    @staticmethod
    def get_all(db: Session):

        return list(
            db.scalars(
                select(Prediction)
                .order_by(Prediction.created_at.desc())
            )
        )

    @staticmethod
    def get_latest(db: Session, limit: int = 10):

        return list(
            db.scalars(
                select(Prediction)
                .order_by(Prediction.created_at.desc())
                .limit(limit)
            )
        )

    @staticmethod
    def get_by_article(db: Session, article_id: int):

        return list(
            db.scalars(
                select(Prediction)
                .join(AIAnalysis)
                .where(AIAnalysis.article_id == article_id)
                .order_by(Prediction.created_at.desc())
            )
        )