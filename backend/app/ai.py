import os
from dotenv import load_dotenv

from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, END

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    groq_api_key=os.getenv("GROQ_API_KEY"),
)

class AgentState(dict):
    pass


def ai_node(state):
    prompt = f"""
You are an AI assistant for Healthcare CRM.

Extract these fields and return ONLY valid JSON.

doctor_name
interaction_type
discussion
outcome
follow_up

Meeting Notes:
{state["text"]}
"""

    response = llm.invoke(prompt)

    return {
        "response": response.content
    }


graph = StateGraph(dict)

graph.add_node("extract", ai_node)

graph.set_entry_point("extract")

graph.add_edge("extract", END)

app_graph = graph.compile()


def generate_summary(text):
    result = app_graph.invoke(
        {
            "text": text
        }
    )

    return result["response"]