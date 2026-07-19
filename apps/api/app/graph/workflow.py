from langgraph.graph import END
from langgraph.graph import START
from langgraph.graph import StateGraph

from app.graph.nodes.load_article import load_article
from app.graph.state import PipelineState
from app.graph.nodes.generate_embedding import generate_embedding
from app.graph.nodes.retrieve_history import retrieve_history
from app.graph.nodes.process_article import process_article
from app.graph.nodes.check_article import check_article
from app.graph.nodes.skip_article import skip_article
from app.graph.nodes.event_analysis import event_analysis

builder = StateGraph(PipelineState)

builder.add_node(
    "load_article",
    load_article,
)

builder.add_node(
    "generate_embedding",
    generate_embedding,
)

builder.add_node(
    "retrieve_history",
    retrieve_history,
)

builder.add_node(
    "check_article",
    check_article,
)

builder.add_node(
    "skip_article",
    skip_article,
)

builder.add_node(
    "process_article",
    process_article,
)

builder.add_node(
    "event_analysis",
    event_analysis,
)

builder.add_edge(
    START,
    "load_article",
)

builder.add_edge(
    "load_article",
    "generate_embedding",
)

builder.add_edge(
    "generate_embedding",
    "retrieve_history",
)

builder.add_edge(
    "retrieve_history",
    "check_article",
)


def route_article(state):
    article = state["article"]

    if article.id % 2 == 0:
        return "skip"

    return "process"

builder.add_conditional_edges(
    "check_article",
    route_article,
    {
        "process": "event_analysis",
        "skip": "skip_article",
    },
)

builder.add_edge(
    "event_analysis",
    "process_article",
)

builder.add_edge(
    "process_article",
    END,
)

builder.add_edge(
    "skip_article",
    END,
)

graph = builder.compile()