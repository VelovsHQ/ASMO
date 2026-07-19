from app.services.history_service import HistoryService


class HistoricalMemoryAgent:

    @staticmethod
    def run(
        db,
        articles,
    ):

        print("\n🧠 Historical Memory Agent")

        cases = HistoryService.build_cases(
            db=db,
            articles=articles,
        )

        history = HistoryService.build_context(
            cases,
        )

        return history