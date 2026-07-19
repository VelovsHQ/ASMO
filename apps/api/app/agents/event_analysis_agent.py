from app.services.ai_service import analyze_article


class EventAnalysisAgent:

    @staticmethod
    def run(
        title: str,
        content: str,
        history: str,
    ):

        print("\n🤖 Event Analysis Agent")

        return analyze_article(
            title,
            content,
            history,
        )