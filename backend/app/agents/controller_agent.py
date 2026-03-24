from langgraph.graph import StateGraph, END
from app.agents.base import AgentState, BaseAgent

def assess_system_health(state):
    state["next_action"] = "idle"
    state["messages"] = state.get("messages", []) + ["health assessed (stub)"]
    return state

def trigger_research(state):
    state["messages"] = state.get("messages", []) + ["research triggered (stub)"]
    return state

def trigger_site_builds(state):
    state["messages"] = state.get("messages", []) + ["site builds triggered (stub)"]
    return state

def trigger_ads_optimisation(state):
    state["messages"] = state.get("messages", []) + ["ads optimisation triggered (stub)"]
    return state

def raise_alerts(state):
    state["completed"] = True
    state["messages"] = state.get("messages", []) + ["alerts raised (stub)"]
    return state

def route_after_health(state):
    action = state.get("next_action", "idle")
    if action == "research": return "trigger_research"
    if action == "build": return "trigger_site_builds"
    if action == "optimise": return "trigger_ads_optimisation"
    return "raise_alerts"

class ControllerAgent(BaseAgent):
    name = "ControllerAgent"
    def build(self):
        g = StateGraph(AgentState)
        g.add_node("assess_system_health", assess_system_health)
        g.add_node("trigger_research", trigger_research)
        g.add_node("trigger_site_builds", trigger_site_builds)
        g.add_node("trigger_ads_optimisation", trigger_ads_optimisation)
        g.add_node("raise_alerts", raise_alerts)
        g.set_entry_point("assess_system_health")
        g.add_conditional_edges("assess_system_health", route_after_health)
        g.add_edge("trigger_research", "raise_alerts")
        g.add_edge("trigger_site_builds", "raise_alerts")
        g.add_edge("trigger_ads_optimisation", "raise_alerts")
        g.add_edge("raise_alerts", END)
        return g.compile()
