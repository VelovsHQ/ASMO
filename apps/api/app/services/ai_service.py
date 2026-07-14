import json

from langchain_google_genai import ChatGoogleGenerativeAI

from app.core.config import settings


llm = ChatGoogleGenerativeAI(
    model="gemini-3.5-flash",
    google_api_key=settings.GEMINI_API_KEY,
    temperature=0,
)


SYSTEM_PROMPT = """
You are a financial analyst.

Return ONLY valid JSON.

{
  "summary": "",
  "event_type": "",
  "sentiment": "",
  "confidence": 0.0,
  "reasoning": ""
}

"""

PREDICTION_PROMPT = """
You are a market analyst.

Given an article, predict the impact on financial markets.

Return ONLY JSON.

{
  "predictions":[
    {
      "market":"Gold",
      "direction":"Bullish",
      "impact_min":1,
      "impact_max":3,
      "confidence":0.91,
      "timeframe":"Short Term",
      "explanation":"..."
    }
  ]
}
"""


def analyze_article(title: str, content: str):

    response = llm.invoke(
        [
            ("system", SYSTEM_PROMPT),
            (
                "human",
                f"Title: {title}\n\nContent:\n{content}",
            ),
        ]
    )

    return json.loads(response.content)


def predict_markets(title: str, content: str):

    response = llm.invoke(
        [
            ("system", PREDICTION_PROMPT),
            (
                "human",
                f"{title}\n\n{content}",
            ),
        ]
    )

    return json.loads(response.content)