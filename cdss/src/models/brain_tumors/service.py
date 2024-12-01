import io
from PIL import Image
import torch
from torchvision import transforms

from .model import TumorClassifier

class BrainTumorClassificationService:
    def __init__(self, model_path: str):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = self._load_model(model_path)
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])

    def _load_model(self, model_path: str):
        model = TumorClassifier(num_classes=4)  # Adjust num_classes as needed
        model.load_state_dict(torch.load(model_path, map_location=self.device))
        model.to(self.device)
        model.eval()
        return model

    def predict_tumor_type(self, image_bytes: bytes):
        image = Image.open(io.BytesIO(image_bytes))
        print("Code Stucks Here")
        image = self.transform(image).unsqueeze(0).to(self.device)
        
        with torch.no_grad():
            output = self.model(image)
            probabilities = torch.nn.functional.softmax(output, dim=1)
            top_prob, predicted = torch.max(probabilities, 1)

        class_names = ['glioma', 'meningioma', 'notumor', 'pituitary']
        predicted_class = class_names[predicted.item()]
        probability = top_prob.item() * 100

        return {"class": predicted_class, "probability": probability}
