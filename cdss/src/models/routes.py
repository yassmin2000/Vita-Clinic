from fastapi import APIRouter, Depends, File, UploadFile
from celery import Celery
from celery.result import AsyncResult
from src.auth.dependencies import ApiKeyHeader
from src.models.service import predict_tumor_type

celery_app = Celery(
    'tasks',
    broker='amqp://guest:guest@localhost:5672/',  
    backend='redis://127.0.0.1:6379', 
)

models_router = APIRouter()

@celery_app.task
def predict_brain_tumor(image_bytes):
    """
    Celery task to process image and predict the tumor type.
    """
    predicted_class, probability = predict_tumor_type(image_bytes)
    return {"class": predicted_class, "probability": probability}

@models_router.post(
    "/predict-brain-tumor",
    summary="Submit brain tumor prediction task",
    description="Uploads an image and starts a background prediction task",
    dependencies=[Depends(ApiKeyHeader())],  # Assuming you have API key authentication
    include_in_schema=True,
    responses={200: {"description": "Task created successfully"}},
)
async def submit_prediction(file: UploadFile = File(...)):
    """
    Accepts an image and submits it to the Celery task for background prediction.
    """
    image_bytes = await file.read() 
    task = predict_brain_tumor.delay(image_bytes) 
    return {"task_id": task.id} 

@models_router.get(
    "/tasks/{task_id}",
    summary="Check task status",
    description="Query the status and result of a prediction task",
)
async def get_task_status(task_id: str):
    """
    Returns the status of the background task.
    """
    task_result = AsyncResult(task_id, app=celery_app) 
    
    if task_result.state == 'SUCCESS':
        return {"task_id": task_id, "status": task_result.state, "result": task_result.result}
    elif task_result.state == 'PENDING':
        return {"task_id": task_id, "status": "PENDING", "message": "Task is still processing."}
    elif task_result.state == 'FAILURE':
        return {"task_id": task_id, "status": "FAILURE", "message": str(task_result.info)} 
    else:
        return {"task_id": task_id, "status": task_result.state}

