from langgraph.graph import END
from langgraph.graph import START
from langgraph.graph import StateGraph

from app.graph.nodes.load_article import load_article
from app.graph.state import PipelineState
from app.graph.nodes.generate_embedding import generate_embedding
from app.graph.nodes.retrieve_history import retrieve_history
from app.graph.nodes.process_article import process_article

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
    "process_article",
    process_article,
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
    "process_article",
)

builder.add_edge(
    "process_article",
    END,
)

graph = builder.compile()