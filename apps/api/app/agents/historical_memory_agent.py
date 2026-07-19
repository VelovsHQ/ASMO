from app.services.history_service import HistoryService


class HistoricalMemoryAgent:

    @staticmethod
    def run(cases):

        print("\n🧠 Historical Memory Agent")

        history = HistoryService.build_context(
            cases,
        )

        return history