from fastapi import APIRouter, Depends
from celery.result import AsyncResult

from src.auth.dependencies import ApiKeyHeader

models_router = APIRouter()

@models_router.get(
    "/tasks/{task_id}",
    summary="Check task status",
    description="Query the status and result of a prediction task",
)
async def get_task_status(task_id: str, dependencies=[Depends(ApiKeyHeader())]):
    """
    Returns the status of the background task.
    """
    task_result = AsyncResult(task_id) 
    
    if task_result.state == 'SUCCESS':
        return {"task_id": task_id, "status": task_result.state, "result": task_result.result}
    elif task_result.state == 'PENDING':
        return {"task_id": task_id, "status": "PENDING", "message": "Task is still processing."}
    elif task_result.state == 'FAILURE':
        return {"task_id": task_id, "status": "FAILURE", "message": str(task_result.info)} 
    else:
        return {"task_id": task_id, "status": task_result.state}

