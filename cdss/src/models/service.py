
import torch
from torchvision import transforms
from PIL import Image
import io
import torch.nn as nn
import torch.nn.functional as F



class TumorClassifier(nn.Module):
    def __init__(self, num_classes):
        super(TumorClassifier, self).__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 16, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
            nn.Conv2d(16, 32, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2)
        )
        self.classifier = nn.Sequential(
            nn.Linear(32 * 56 * 56, 128),
            nn.ReLU(inplace=True),
            nn.Linear(128, num_classes)
        )

    def forward(self, x):
        x = self.features(x)
        x = x.view(x.size(0), -1)
        x = self.classifier(x)
        return x



def load_model(model_path):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = TumorClassifier(num_classes=4)  # Adjust num_classes as needed
    model.load_state_dict(torch.load(model_path, map_location=device))  # Load weights
    model.to(device)
    model.eval()  # Set to evaluation mode
    return model

model = load_model('./brain_tumer.pt')




def predict_tumor_type(image_bytes):
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    image = Image.open(io.BytesIO(image_bytes))
    image = transform(image).unsqueeze(0).to(next(model.parameters()).device)
    
    with torch.no_grad():
        output = model(image)
        probabilities = F.softmax(output, dim=1)
        top_prob, predicted = torch.max(probabilities, 1)
    
    class_names = ['glioma', 'meningioma', 'notumor', 'pituitary']  # Replace with your actual class names
    predicted_class = class_names[predicted.item()]
    probability = top_prob.item() * 100  # Convert to percentage
    
    return predicted_class, probability

# class ModelService:
    
    
    # @celery_app.task
    # @staticmethod
    # def predict_brain_tumer(service, image_bytes):
    #     predicted_class, probability = service.predict_tumor_type(image_bytes)
    #     return {"class": predicted_class,
    #             "probability": probability}
