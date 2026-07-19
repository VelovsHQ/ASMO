class AlertAgent:

    @staticmethod
    def run(
        review,
        portfolio_actions,
    ):

        print("\n🚨 Alert Agent")

        if review["decision"] == "reject":

            return {
                "send": False,
                "priority": "none",
                "reason": "Low confidence",
            }

        high_priority = any(
            action["confidence"] >= 0.90
            for action in portfolio_actions
        )

        if high_priority:

            return {
                "send": True,
                "priority": "high",
                "reason": "High confidence market event",
            }

        return {
            "send": True,
            "priority": "normal",
            "reason": "Normal market event",
        }