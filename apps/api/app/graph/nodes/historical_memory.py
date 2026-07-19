from app.agents.historical_memory_agent import HistoricalMemoryAgent


def historical_memory(state):

    history = HistoricalMemoryAgent.run(
        state["historical_articles"],
    )

    state["history"] = history

    print("✅ Historical Memory Complete")

    return state