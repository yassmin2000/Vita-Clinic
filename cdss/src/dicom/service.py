from fastapi import HTTPException
from fastapi.concurrency import run_in_threadpool

import io
import httpx
import pydicom as dicom
import cv2
import numpy as np
from PIL import Image


class DicomService:
    async def convert_dicom_to_image(
        self, file_url: str, extension: str = "jpeg"
    ) -> io.BytesIO:
        async with httpx.AsyncClient() as client:
            response = await client.get(file_url, timeout=300)
        if response.status_code != 200:
            raise HTTPException(
                status_code=404, detail="DICOM file not found at the provided URL"
            )
        dicom_data = io.BytesIO(response.content)

        try:
            # Run DICOM reading and image processing in a separate thread
            img_bytes = await run_in_threadpool(
                self.process_dicom_data, dicom_data, extension
            )
        except Exception:
            img_bytes = self.create_black_image(extension)

        return img_bytes

    def process_dicom_data(self, dicom_data: io.BytesIO, extension: str) -> io.BytesIO:
        ds = dicom.dcmread(dicom_data)
        pixel_array_numpy = ds.pixel_array

        if pixel_array_numpy.dtype != np.uint8:
            pixel_array_numpy = cv2.normalize(
                pixel_array_numpy, None, 0, 255, cv2.NORM_MINMAX
            )
            pixel_array_numpy = np.uint8(pixel_array_numpy)

        # Encode the image to the desired format
        is_png = extension.lower() == "png"
        _, img_encoded = cv2.imencode(".png" if is_png else ".jpeg", pixel_array_numpy)
        if img_encoded is None:
            raise HTTPException(status_code=500, detail="Failed to encode image")

        # Convert to BytesIO for returning as response
        return io.BytesIO(img_encoded)

    def create_black_image(self, extension: str) -> io.BytesIO:
        # Create a black image using Pillow
        black_image = Image.new("RGB", (512, 512), (0, 0, 0))
        img_bytes = io.BytesIO()
        black_image.save(img_bytes, format=extension.upper())
        img_bytes.seek(0)
        return img_bytes
