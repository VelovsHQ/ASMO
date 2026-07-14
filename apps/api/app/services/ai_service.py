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