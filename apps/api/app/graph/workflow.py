from langgraph.graph import END
from langgraph.graph import START
from langgraph.graph import StateGraph

from app.graph.nodes.load_article import load_article
from app.graph.state import PipelineState

builder = StateGraph(PipelineState)

builder.add_node(
    "load_article",
    load_article,
)

builder.add_edge(
    START,
    "load_article",
)

builder.add_edge(
    "load_article",
    END,
)

graph = builder.compile()