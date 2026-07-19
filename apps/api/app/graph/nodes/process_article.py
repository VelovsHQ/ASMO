from app.services.pipeline_service import PipelineService

def process_article(state):

    result = PipelineService.process_article(
        state["article"].id
    )

    state["result"] = result

    print("✅ Pipeline Finished")

    return state