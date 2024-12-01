from celery import Celery

from src.config import Config
from src.models.brain_tumors.service import BrainTumorClassificationService

celery_app = Celery(
    'tasks',
    broker=Config.CELERY_BROKER_URL,
    backend=Config.CELERY_RESULT_BACKEND
)

brain_tumor_service = BrainTumorClassificationService('./src/models/brain_tumors/weights/brain_tumors.pt')

@celery_app.task
def predict_brain_tumor_task(image_bytes):
    return brain_tumor_service.predict_tumor_type(image_bytes)
