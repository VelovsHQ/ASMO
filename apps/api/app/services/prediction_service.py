from app.db.session import SessionLocal
from app.models.prediction import Prediction


class PredictionService:

    @staticmethod
    def create(**kwargs):

        db = SessionLocal()

        prediction = Prediction(**kwargs)

        db.add(prediction)

        db.commit()

        db.refresh(prediction)

        db.close()

        return prediction