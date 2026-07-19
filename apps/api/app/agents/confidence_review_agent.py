class ConfidenceReviewAgent:

    @staticmethod
    def run(
        analysis,
        predictions,
    ):

        print("\n🛡️ Confidence Review Agent")

        confidence = analysis.confidence

        if confidence >= 0.80:
            decision = "approve"

        elif confidence >= 0.60:
            decision = "review"

        else:
            decision = "reject"

        return {
            "decision": decision,
            "confidence": confidence,
        }