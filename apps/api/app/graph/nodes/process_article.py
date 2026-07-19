from app.services.pipeline_service import PipelineService

def process_article(state):

    result = PipelineService.process_article(
    article_id=state["article"].id,
    analysis=state["analysis_model"],
)

    state["result"] = result

    print("✅ Pipeline Finished")

    return state