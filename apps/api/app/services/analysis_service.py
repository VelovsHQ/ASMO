from sqlalchemy import select

from app.db.session import SessionLocal
from app.models.ai_analysis import AIAnalysis


class AnalysisService:

    @staticmethod
    def create(**kwargs):

        db = SessionLocal()

        analysis = AIAnalysis(**kwargs)

        db.add(analysis)

        db.commit()

        db.refresh(analysis)

        db.close()

        return analysis