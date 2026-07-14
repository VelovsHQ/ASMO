from sqlalchemy import select

from app.db.session import SessionLocal
from app.models.article import Article

from app.services.ai_service import analyze_article, predict_markets
from app.services.analysis_service import AnalysisService
from app.services.prediction_service import PredictionService
from app.models.market import Market


db = SessionLocal()

article = db.scalar(select(Article).limit(1))

result = analyze_article(
    article.title,
    article.content,
)

analysis = AnalysisService.create(
    article_id=article.id,
    summary=result["summary"],
    event_type=result["event_type"],
    sentiment=result["sentiment"],
    reasoning=result["reasoning"],
    confidence=result["confidence"],
    model_name="gemini-2.5-flash",
)

print(analysis.id)
predictions = predict_markets(
    article.title,
    article.content,
)

for item in predictions["predictions"]:

    market = db.scalar(
        select(Market).where(
            Market.name == item["market"]
        )
    )

    if not market:
        continue

    PredictionService.create(
        analysis_id=analysis.id,
        market_id=market.id,
        direction=item["direction"],
        impact_min=item["impact_min"],
        impact_max=item["impact_max"],
        confidence=item["confidence"],
        timeframe=item["timeframe"],
        explanation=item["explanation"],
    )

print(analysis.id)