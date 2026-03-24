from langgraph.graph import StateGraph, END
from app.agents.base import AgentState, BaseAgent

def gather_market_data(state):
    state["messages"] = state.get("messages", []) + ["market data gathered (stub)"]
    return state

def compute_financials(state):
    state["estimated_monthly_revenue"] = 0.0
    state["estimated_roas"] = 0.0
    state["messages"] = state.get("messages", []) + ["financials computed (stub)"]
    return state

def recommend_budget(state):
    state["recommended_budget"] = 0.0
    state["messages"] = state.get("messages", []) + ["budget recommended (stub)"]
    return state

def make_go_no_go(state):
    state["go_no_go"] = "no_go"
    state["completed"] = True
    state["messages"] = state.get("messages", []) + ["go/no-go decided (stub)"]
    return state

class BusinessCaseAgent(BaseAgent):
    name = "BusinessCaseAgent"
    def build(self):
        g = StateGraph(AgentState)
        g.add_node("gather_market_data", gather_market_data)
        g.add_node("compute_financials", compute_financials)
        g.add_node("recommend_budget", recommend_budget)
        g.add_node("make_go_no_go", make_go_no_go)
        g.set_entry_point("gather_market_data")
        g.add_edge("gather_market_data", "compute_financials")
        g.add_edge("compute_financials", "recommend_budget")
        g.add_edge("recommend_budget", "make_go_no_go")
        g.add_edge("make_go_no_go", END)
        return g.compile()
