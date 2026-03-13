from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class BodyAnalysisRequest(BaseModel):
    image_url: str
    user_id: str

class VirtualTryOnRequest(BaseModel):
    user_image_url: str
    product_image_url: str
    body_landmarks: List[Dict[str, float]]
    product_metadata: Dict[str, Any]

class SizeRecommendationRequest(BaseModel):
    body_measurements: Dict[str, float]
    product_measurements: Dict[str, Dict[str, float]]  # size -> measurements
    product_category: str
    user_id: Optional[str] = None

class StyleRecommendationRequest(BaseModel):
    user_id: str
    preferences: Optional[Dict[str, Any]] = None
    limit: int = 10