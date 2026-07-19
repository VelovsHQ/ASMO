from app.agents.historical_memory_agent import HistoricalMemoryAgent


def historical_memory(state):

    print("\n🧠 Historical Memory")

    history = HistoricalMemoryAgent.run(
        state["historical_articles"],
    )

    state["history"] = history

    print("✅ Historical Memory Complete")

    return state