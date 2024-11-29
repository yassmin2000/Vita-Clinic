from fastapi import HTTPException
from fastapi.concurrency import run_in_threadpool

import io
import httpx
import cv2
import pydicom as dicom
import numpy as np
from PIL import Image


class DicomService:
    async def convert_dicom_to_image(
        self, file_url: str, extension: str = "jpeg"
    ) -> io.BytesIO:
        """
        Fetch a DICOM file from a URL, process it, and return it as a PNG or JPEG image.
        :param file_url: URL of the DICOM file.
        :param extension: Desired output image format ('jpeg' or 'png').
        :return: BytesIO object containing the encoded image.
        """
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
        except Exception as e:
            print("Failed to process DICOM file. Returning a black image.")
            print("Error:", e)
            img_bytes = self.create_black_image(extension)

        return img_bytes

    def process_dicom_data(self, dicom_data: io.BytesIO, extension: str) -> io.BytesIO:
        """
        Process the DICOM data to extract an image and enhance contrast.
        :param dicom_data: BytesIO object containing the DICOM file.
        :param extension: Desired output image format ('jpeg' or 'png').
        :return: BytesIO object containing the encoded image.
        """
        # Read the DICOM file
        ds = dicom.dcmread(dicom_data)
        pixel_array = ds.pixel_array

        # Normalize the image to 0-255
        if pixel_array.dtype != np.uint8:
            pixel_array = cv2.normalize(pixel_array, None, 0, 255, cv2.NORM_MINMAX)
            pixel_array = np.uint8(pixel_array)

        # Apply auto contrast
        pixel_array = self.apply_auto_contrast(pixel_array)

        # Encode the image to the desired format
        is_png = extension.lower() == "png"
        _, img_encoded = cv2.imencode(".png" if is_png else ".jpeg", pixel_array)
        if img_encoded is None:
            raise HTTPException(status_code=500, detail="Failed to encode image")

        # Convert to BytesIO for returning as response
        return io.BytesIO(img_encoded)

    def apply_auto_contrast(self, image: np.ndarray) -> np.ndarray:
        """
        Enhance image contrast using auto contrast logic.
        :param image: Input image as a numpy array.
        :return: Contrast-enhanced image as a numpy array.
        """
        hist, _ = np.histogram(image.ravel(), bins=np.arange(257))
        cdf = np.cumsum(hist)
        cdf_normalized = cdf / cdf[-1]

        p_low = np.argmax(cdf_normalized >= 0.01)
        p_high = np.argmax(cdf_normalized >= 0.99)

        if p_high > p_low:
            scale = 255.0 / (p_high - p_low)
            offset = -scale * p_low
            image = (image.astype(np.float32) * scale + offset).clip(0, 255)
        return image.astype(np.uint8)

    def create_black_image(self, extension: str) -> io.BytesIO:
        """
        Create a fallback black image in case of an error.
        :param extension: Desired output image format ('jpeg' or 'png').
        :return: BytesIO object containing the black image.
        """
        black_image = Image.new("RGB", (512, 512), (0, 0, 0))
        img_bytes = io.BytesIO()
        black_image.save(img_bytes, format=extension.upper())
        img_bytes.seek(0)
        return img_bytes
