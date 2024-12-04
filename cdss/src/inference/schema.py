from pydantic import BaseModel


class InferenceSchema(BaseModel):
    predictionId: str
    instance: str
