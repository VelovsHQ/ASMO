from sqlalchemy import select

from app.db.session import SessionLocal
from app.models.market import Market

from app.agents.market_prediction_agent import MarketPredictionAgent
from app.agents.event_analysis_agent import EventAnalysisAgent
from app.services.analysis_service import AnalysisService
from app.services.article_service import ArticleService
from app.services.prediction_service import PredictionService
from app.services.embedding_service import EmbeddingService
from app.services.article_embedding_service import ArticleEmbeddingService
from app.services.history_service import HistoryService
from app.agents.historical_memory_agent import HistoricalMemoryAgent
from app.agents.confidence_review_agent import ConfidenceReviewAgent
from app.agents.portfolio_impact_agent import PortfolioImpactAgent
from app.agents.alert_agent import AlertAgent


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

            history = HistoricalMemoryAgent.run(
                db=db,
                articles=historical_articles,
            )

            print("\n")
            print("=" * 60)
            print("HISTORICAL CASES")
            print("=" * 60)
            print(history[:2500])

            print("\nHistory Length:", len(history))

            # AI Analysis
            analysis_result = EventAnalysisAgent.run(
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
            prediction_result = MarketPredictionAgent.run(
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

            review = ConfidenceReviewAgent.run(
                analysis,
                created_predictions,
            )

            print(review)

            portfolio_actions = PortfolioImpactAgent.run(
                created_predictions,
            )

            print(portfolio_actions)
            alert = AlertAgent.run(
                review,
                portfolio_actions,
            )

            print(alert)
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