from sqlalchemy import select

from app.db.session import SessionLocal
from app.models.market import Market

from app.services.ai_service import (
    analyze_article,
    predict_markets,
)
from app.services.analysis_service import AnalysisService
from app.services.article_service import ArticleService
from app.services.prediction_service import PredictionService
from app.services.embedding_service import EmbeddingService
from app.services.article_embedding_service import ArticleEmbeddingService
from app.services.history_service import HistoryService


class PipelineService:

    @staticmethod
    def process_article(article_id: int):

        db = SessionLocal()

        try:

            # Load article
            article = ArticleService.get_by_id(
                db,
                article_id,
            )

            if article is None:
                raise ValueError(f"Article {article_id} not found")

            embedding = EmbeddingService.generate_embedding(
                article.content,
            )

            similar_embeddings = (
                ArticleEmbeddingService.find_similar(
                    db=db,
                    embedding=embedding,
                    limit=5,
                )
            )

            historical_articles = (
                ArticleEmbeddingService.get_articles_from_embeddings(
                    db=db,
                    embeddings=similar_embeddings,
                )
            )

            print("\n" + "=" * 60)
            print("RAG RETRIEVAL")
            print("=" * 60)

            for historical_article in historical_articles:
                print(f"Article #{historical_article.id}")
                print(historical_article.title)
                print("-" * 60)

            cases = HistoryService.build_cases(
                db=db,
                articles=historical_articles,
            )

            history = HistoryService.build_context(cases)

            print("\n")
            print("=" * 60)
            print("HISTORICAL CASES")
            print("=" * 60)
            print(history[:2500])

            print("\nHistory Length:", len(history))

            # AI Analysis
            analysis_result = analyze_article(
                article.title,
                article.content,
                history,
            )

            analysis = AnalysisService.create(
                db,
                article_id=article.id,
                summary=analysis_result["summary"],
                event_type=analysis_result["event_type"],
                sentiment=analysis_result["sentiment"],
                reasoning=analysis_result["reasoning"],
                confidence=analysis_result["confidence"],
                model_name="llama-3.3-70b-versatile",
            )

            # Market Predictions
            prediction_result = predict_markets(
                article.title,
                article.content,
            )

            created_predictions = []

            for item in prediction_result["predictions"]:

                market = db.scalar(
                    select(Market).where(
                        Market.name == item["market"]
                    )
                )

                if market is None:
                    continue

                prediction = PredictionService.create(
                    db,
                    analysis_id=analysis.id,
                    market_id=market.id,
                    direction=item["direction"],
                    impact_min=item["impact_min"],
                    impact_max=item["impact_max"],
                    confidence=item["confidence"],
                    timeframe=item["timeframe"],
                    explanation=item["explanation"],
                )

                created_predictions.append(prediction)

            article_id = article.id
            analysis_id = analysis.id
            prediction_count = len(created_predictions)

            # ONE transaction
            db.commit()

            return {
                "article": article_id,
                "analysis": analysis_id,
                "predictions": prediction_count,
            }

        except Exception:
            db.rollback()
            raise

        finally:
            db.close()