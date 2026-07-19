from app.services.ai_service import predict_markets


class MarketPredictionAgent:

    @staticmethod
    def run(
        title: str,
        content: str,
    ):

        print("\n📈 Market Prediction Agent")

        return predict_markets(
            title,
            content,
        )