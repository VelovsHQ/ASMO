class HistoricalMemoryAgent:

    @staticmethod
    def run(cases):

        history = HistoryService.build_context(
            cases,
        )

        return history