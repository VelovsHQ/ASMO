from app.agents.event_analysis_agent import EventAnalysisAgent


def event_analysis(state):

    article = state["article"]

    history = state["history"]

    analysis = EventAnalysisAgent.run(
        article.title,
        article.content,
        history,
    )

    state["analysis"] = analysis

    print("✅ Event Analysis Complete")

    return state