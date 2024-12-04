from fastapi import APIRouter, Depends

from src.auth.dependencies import ApiKeyHeader
from src.inference.schema import InferenceSchema
from src.inference.celery_jobs import predict_chest_ctscan_task

chest_ct_cancer_classification_router = APIRouter()


@chest_ct_cancer_classification_router.post(
    "/",
    dependencies=[Depends(ApiKeyHeader())],
    summary="Submit a chest CT scan prediction task",
    description="Submit an image for chest CT scan prediction",
)
async def submit_prediction(inferenceSchema: InferenceSchema):
    """
    Submit a chest CT scan cancer prediction task.

    Args:
        inferenceSchema (InferenceSchema): Schema containing the instance URL of the CT scan image.

    Returns:
        dict: Contains the task ID of the submitted Celery task.
    """
    task = predict_chest_ctscan_task.delay(
        inferenceSchema.predictionId, inferenceSchema.instance
    )
    return {"task_id": task.id}
