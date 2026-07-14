from sqlalchemy.orm import Session

from app.models.prediction import Prediction


class PredictionService:

    @staticmethod
    def create(db: Session, **kwargs):

        prediction = Prediction(**kwargs)

        db.add(prediction)

        db.flush()

        return prediction