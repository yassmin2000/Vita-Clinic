from fastapi import APIRouter, Depends, File, UploadFile
from celery.result import AsyncResult
from src.auth.dependencies import ApiKeyHeader
from src.models.celery_jobs import predict_brain_tumor_task
from src.models.brain_tumors.service import BrainTumorClassificationService

brain_tumor_router = APIRouter()

brain_tumor_service = BrainTumorClassificationService('./src/models/brain_tumors/weights/brain_tumors.pt')

@brain_tumor_router.post("/predict", dependencies=[Depends(ApiKeyHeader())])
async def submit_prediction(file: UploadFile = File(...)):
    image_bytes = await file.read()
    task = predict_brain_tumor_task.delay(image_bytes)
    return {"task_id": task.id}