class PortfolioImpactAgent:

    @staticmethod
    def run(predictions):

        print("\n💼 Portfolio Impact Agent")

        actions = []

        for prediction in predictions:

            if prediction.direction == "bullish":
                action = "Increase Exposure"

            elif prediction.direction == "bearish":
                action = "Reduce Exposure"

            else:
                action = "Hold Position"

            actions.append(
                {
                    "market": prediction.market.name,
                    "action": action,
                    "confidence": prediction.confidence,
                }
            )

        return actions