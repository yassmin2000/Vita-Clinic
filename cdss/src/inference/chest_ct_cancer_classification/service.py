import torch
import torchvision.transforms as transforms
from io import BytesIO
from PIL import Image

from .model import ChestCTCancerClassifier


class ChestCTCancerClassificationService:
    """
    A service for chest CT scan cancer classification.

    Handles model loading, image preprocessing, and prediction.

    Attributes:
        model (ChestCTCancerClassifier): The classifier model.
        device (torch.device): Device for computation (CPU or GPU).
        transform (torchvision.transforms.Compose): Transformations for preprocessing images.
        class_names (list[str]): List of class names corresponding to output labels.
    """

    def __init__(self, model_path):
        """
        Initialize the classification service.

        Args:
            model_path (str): Path to the pre-trained model weights.
        """
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = ChestCTCancerClassifier(num_classes=4).to(self.device)
        self.model.load_weights(model_path)
        self.class_names = [
            "adenocarcinoma_left.lower.lobe_T2_N0_M0_Ib",
            "large.cell.carcinoma_left.hilum_T2_N2_M0_IIIa",
            "normal",
            "squamous.cell.carcinoma_left",
        ]
        self.transform = transforms.Compose(
            [
                transforms.Resize((224, 224)),
                transforms.ToTensor(),
                transforms.Normalize(
                    mean=[0.485, 0.456, 0.406],
                    std=[0.229, 0.224, 0.225],
                ),
            ]
        )

    def preprocess_image(self, image_bytes):
        """
        Preprocess the input image for model inference.

        Args:
            image_bytes (bytes): Byte representation of the input image.

        Returns:
            torch.Tensor: Preprocessed image tensor ready for inference.
        """
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
        image = self.transform(image).unsqueeze(0).to(self.device)
        return image

    def predict(self, image_bytes):
        """
        Predict the cancer type from the chest CT scan image.

        Args:
            image_bytes (bytes): Byte representation of the input image.

        Returns:
            dict: Predicted cancer type and its probability.
        """
        image = self.preprocess_image(image_bytes)
        with torch.no_grad():
            outputs = self.model(image)
            _, predicted = torch.max(outputs, 1)
            probability = torch.softmax(outputs, dim=1)[0][predicted].item()

        return {
            "class": self.class_names[predicted.item()],
            "probability": probability,
        }
