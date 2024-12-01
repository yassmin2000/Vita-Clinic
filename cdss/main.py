import uvicorn
from fastapi import FastAPI

from src.dicom.routes import dicom_router
from src.models.routes import models_router
from src.models.brain_tumors.routes import brain_tumor_router

version = "v1"

app = FastAPI(
    title="Vita CDSS",
    description="Vita CDSS API",
    version=version,
    openapi={
        "components": {
            "securitySchemes": {
                "ApiKeyAuth": {
                    "type": "apiKey",
                    "in": "header",
                    "name": "X-API-KEY",
                }
            }
        },
        "security": [{"ApiKeyAuth": []}],
    },
)

app.include_router(dicom_router, prefix=f"/api/{version}/dicom", tags=["DICOM"])
app.include_router(models_router, prefix=f"/api/{version}/models", tags=["MODEL"])
app.include_router(brain_tumor_router, prefix=f"/api/{version}/models/brain-tumors", tags=["MODEL"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
