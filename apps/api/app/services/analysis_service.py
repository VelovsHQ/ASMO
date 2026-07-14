from sqlalchemy.orm import Session

from app.models.ai_analysis import AIAnalysis


class AnalysisService:

    @staticmethod
    def create(db: Session, **kwargs):

        analysis = AIAnalysis(**kwargs)

        db.add(analysis)

        db.flush()

        return analysis