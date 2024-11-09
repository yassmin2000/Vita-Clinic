from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse

from src.dicom.service import DicomService
from src.auth.dependencies import ApiKeyHeader

dicom_router = APIRouter()
dicom_service = DicomService()


@dicom_router.get(
    "/preview",
    response_class=StreamingResponse,
    summary="Preview DICOM file as JPEG or PNG",
    description="Returns a DICOM image as JPEG or PNG format",
    dependencies=[Depends(ApiKeyHeader())],
    include_in_schema=True,
    responses={
        200: {
            "content": {
                "image/png": {},
                "image/jpeg": {},
            },
            "description": "DICOM image",
        },
        401: {"description": "Unauthorized"},
        404: {"description": "DICOM file not found at the provided URL"},
    },
)
async def preview_dicom_file(
    file_url: str = Query(
        ...,
        pattern="^https?://.*$",
        alias="fileURL",
        description="URL of the DICOM file",
        example="https://example.com/dicom.dcm",
    ),
    extension: str = Query(
        "jpeg",
        enum=["jpeg", "png"],
        description="Image format to convert to",
    ),
) -> StreamingResponse:
    image = await dicom_service.convert_dicom_to_image(file_url, extension)
    return StreamingResponse(image, media_type=f"image/{extension.lower()}")
