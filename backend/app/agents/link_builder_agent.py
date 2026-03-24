from langgraph.graph import StateGraph, END
from app.agents.base import AgentState, BaseAgent

def search_products(state):
    state["affiliate_products"] = []
    state["messages"] = state.get("messages", []) + ["products searched (stub)"]
    return state

def score_and_filter(state):
    state["messages"] = state.get("messages", []) + ["products filtered (stub)"]
    return state

def generate_links(state):
    state["links_created"] = 0
    state["completed"] = True
    state["messages"] = state.get("messages", []) + ["links generated (stub)"]
    return state

class LinkBuilderAgent(BaseAgent):
    name = "LinkBuilderAgent"
    def build(self):
        g = StateGraph(AgentState)
        g.add_node("search_products", search_products)
        g.add_node("score_and_filter", score_and_filter)
        g.add_node("generate_links", generate_links)
        g.set_entry_point("search_products")
        g.add_edge("search_products", "score_and_filter")
        g.add_edge("score_and_filter", "generate_links")
        g.add_edge("generate_links", END)
        return g.compile()
