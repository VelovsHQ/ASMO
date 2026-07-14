from fastapi import APIRouter, HTTPException

from app.services.pipeline_service import PipelineService

router = APIRouter(
    prefix="/pipeline",
    tags=["Pipeline"],
)


@router.post("/process/{article_id}")
def process_article(article_id: int):

    try:
        result = PipelineService.process_article(article_id)

        return {
            "success": True,
            "data": result,
        }

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )