from app.services.history_service import HistoryService
class HistoricalMemoryAgent:

    @staticmethod
    def run(cases):

        history = HistoryService.build_context(
            cases,
        )

        return history