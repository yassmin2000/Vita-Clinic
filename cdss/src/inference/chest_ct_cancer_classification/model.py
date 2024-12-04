import torch
import torch.nn as nn
from torchvision import models


class ChestCTCancerClassifier(nn.Module):
    """
    A classifier model for chest CT scan cancer prediction.

    This model is based on a ResNet-18 architecture and is fine-tuned for cancer classification.

    Attributes:
        model (torchvision.models.resnet.ResNet): The ResNet-18 model with a customized fully connected layer.
    """

    def __init__(self, num_classes=4):
        """
        Initialize the ChestCTCancerClassifier.

        Args:
            num_classes (int, optional): Number of output classes. Defaults to 4.
        """
        super(ChestCTCancerClassifier, self).__init__()
        self.model = models.resnet18(pretrained=False)
        num_ftrs = self.model.fc.in_features
        self.model.fc = nn.Linear(num_ftrs, num_classes)

    def forward(self, x):
        """
        Forward pass of the model.

        Args:
            x (torch.Tensor): Input tensor of shape (batch_size, 3, height, width).

        Returns:
            torch.Tensor: Output tensor of shape (batch_size, num_classes).
        """
        return self.model(x)

    def load_weights(self, model_path):
        """
        Load pre-trained weights into the model.

        Args:
            model_path (str): Path to the model weights file.
        """
        self.load_state_dict(
            torch.load(model_path, map_location=torch.device("cpu")), strict=False
        )
        self.eval()
