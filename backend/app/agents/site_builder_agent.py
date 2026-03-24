from langgraph.graph import StateGraph, END
from app.agents.base import AgentState, BaseAgent

def provision_subdomain(state):
    state["messages"] = state.get("messages", []) + ["subdomain provisioned (stub)"]
    return state

def generate_content(state):
    state["pages_generated"] = []
    state["messages"] = state.get("messages", []) + ["content generated (stub)"]
    return state

def inject_affiliate_links(state):
    state["messages"] = state.get("messages", []) + ["links injected (stub)"]
    return state

def publish_pages(state):
    state["pages_published"] = 0
    state["completed"] = True
    state["messages"] = state.get("messages", []) + ["pages published (stub)"]
    return state

class SiteBuilderAgent(BaseAgent):
    name = "SiteBuilderAgent"
    def build(self):
        g = StateGraph(AgentState)
        g.add_node("provision_subdomain", provision_subdomain)
        g.add_node("generate_content", generate_content)
        g.add_node("inject_affiliate_links", inject_affiliate_links)
        g.add_node("publish_pages", publish_pages)
        g.set_entry_point("provision_subdomain")
        g.add_edge("provision_subdomain", "generate_content")
        g.add_edge("generate_content", "inject_affiliate_links")
        g.add_edge("inject_affiliate_links", "publish_pages")
        g.add_edge("publish_pages", END)
        return g.compile()
