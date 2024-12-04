from fastapi import APIRouter, Depends

from src.auth.dependencies import ApiKeyHeader
from src.inference.schema import InferenceSchema
from src.inference.celery_jobs import predict_brain_tumors_task

brain_tumors_classification_router = APIRouter()


@brain_tumors_classification_router.post(
    "/",
    dependencies=[Depends(ApiKeyHeader())],
    summary="Submit a brain tumor prediction task",
    description="Submit an image for brain tumor prediction",
)
async def submit_prediction(inferenceSchema: InferenceSchema):
    """
    Submit a brain tumor prediction task.

    Args:
        inferenceSchema (InferenceSchema): Schema containing the instance URL of the DICOM image.

    Returns:
        dict: Contains the task ID of the submitted Celery task.
    """
    task = predict_brain_tumors_task.delay(
        inferenceSchema.predictionId, inferenceSchema.instance
    )
    return {"task_id": task.id}
