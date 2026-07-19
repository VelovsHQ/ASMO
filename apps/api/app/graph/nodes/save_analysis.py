from app.db.session import SessionLocal
from app.services.analysis_service import AnalysisService


def save_analysis(state):

    print("\n💾 Save Analysis")

    db = SessionLocal()

    try:

        analysis = AnalysisService.create(
            db,
            article_id=state["article"].id,
            summary=state["analysis"]["summary"],
            event_type=state["analysis"]["event_type"],
            sentiment=state["analysis"]["sentiment"],
            reasoning=state["analysis"]["reasoning"],
            confidence=state["analysis"]["confidence"],
            model_name="llama-3.3-70b-versatile",
        )

        db.commit()
        db.refresh(analysis)

        state["analysis_model"] = analysis

        return state

    finally:
        db.close()