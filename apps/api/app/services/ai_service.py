import json

from openai import OpenAI

from app.core.config import settings

client = OpenAI(
    api_key=settings.GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1",
)

MODEL = "llama-3.3-70b-versatile"

SYSTEM_PROMPT = """
You are an expert financial market analyst.

Return ONLY valid JSON.

{
  "summary": "",
  "event_type": "",
  "sentiment": "bullish | bearish | neutral",
  "confidence": 0.0,
  "reasoning": ""
}

Do not wrap the JSON in markdown.
Do not output any explanation.
"""

PREDICTION_PROMPT = """
You are an expert financial market strategist.
Analyze the supplied news article and predict which financial markets will be affected.

Rules:
- Use ONLY these market names:
  - Gold
  - Silver
  - Crude Oil
  - Natural Gas
  - S&P 500
  - NASDAQ
  - Dow Jones
  - Bitcoin
  - Ethereum
  - USD Index
- Never invent market names such as Stocks, Bonds, Dollar, or Equities.
- Return only valid JSON matching the specified format.

The JSON MUST have this exact structure:

{
  "predictions": [
    {
      "market": "Gold",
      "direction": "Bullish",
      "impact_min": 1,
      "impact_max": 3,
      "confidence": 0.91,
      "timeframe": "Short Term",
      "explanation": "Reason for the prediction"
    }
  ]
}

Every prediction object MUST contain ALL of these fields:
- market
- direction
- impact_min
- impact_max
- confidence
- timeframe
- explanation

Use one of these timeframe values only:
- Immediate
- Short Term
- Medium Term
- Long Term

Never omit any required field, even if you are uncertain.

Do not omit the top-level `predictions` key.
"""


def analyze_article(
    title: str,
    content: str,
    history: str = "",
):

    response = client.chat.completions.create(
        model=MODEL,
        temperature=0,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": f"""
==================================================
CURRENT ARTICLE
==================================================

Title:
{title}

Content:
{content}

==================================================
HISTORICAL MARKET CASES
==================================================

{history}

==================================================

Use the historical cases as reference only.

Do not copy previous predictions.

Instead:

1. Compare similarities.

2. Identify differences.

3. Explain whether the current article is likely to produce similar market reactions.

4. Produce an independent prediction.
""",
            },
        ],
    )

    return json.loads(
        response.choices[0].message.content
    )


def predict_markets(title: str, content: str):

    response = client.chat.completions.create(
        model=MODEL,
        temperature=0,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": PREDICTION_PROMPT,
            },
            {
                "role": "user",
                "content": f"Title: {title}\n\nContent:\n{content}",
            },
        ],
    )

    return json.loads(
        response.choices[0].message.content
    )