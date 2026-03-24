from langgraph.graph import StateGraph, END
from app.agents.base import AgentState, BaseAgent

def fetch_keyword_data(state):
    print("[ResearchAgent] fetch_keyword_data — stub")
    state["keyword_data"] = []
    state["messages"] = state.get("messages", []) + ["keyword_data fetched (stub)"]
    return state

def fetch_trend_data(state):
    print("[ResearchAgent] fetch_trend_data — stub")
    state["trend_data"] = []
    state["messages"] = state.get("messages", []) + ["trend_data fetched (stub)"]
    return state

def analyse_competition(state):
    print("[ResearchAgent] analyse_competition — stub")
    state["competition_score"] = 0.0
    state["search_volume"] = 0
    state["messages"] = state.get("messages", []) + ["competition analysed (stub)"]
    return state

def rank_niches(state):
    print("[ResearchAgent] rank_niches — stub")
    state["score"] = 0.0
    state["completed"] = True
    state["messages"] = state.get("messages", []) + ["niches ranked (stub)"]
    return state

def handle_error(state):
    print(f"[ResearchAgent] ERROR: {state.get('error')}")
    state["completed"] = True
    return state

class ResearchAgent(BaseAgent):
    name = "ResearchAgent"
    def build(self):
        g = StateGraph(AgentState)
        g.add_node("fetch_keyword_data", fetch_keyword_data)
        g.add_node("fetch_trend_data", fetch_trend_data)
        g.add_node("analyse_competition", analyse_competition)
        g.add_node("rank_niches", rank_niches)
        g.add_node("handle_error", handle_error)
        g.set_entry_point("fetch_keyword_data")
        g.add_edge("fetch_keyword_data", "fetch_trend_data")
        g.add_edge("fetch_trend_data", "analyse_competition")
        g.add_edge("analyse_competition", "rank_niches")
        g.add_edge("rank_niches", END)
        g.add_edge("handle_error", END)
        return g.compile()
