from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv

from services.body_analysis_service import BodyAnalysisService
from services.virtual_tryon_service import VirtualTryOnService
from services.recommendation_service import RecommendationService
from models.requests import (
    BodyAnalysisRequest,
    VirtualTryOnRequest,
    SizeRecommendationRequest
)

load_dotenv()

app = FastAPI(
    title="Virtual Try-On AI Services",
    description="AI microservices for virtual clothing try-on platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
body_analysis_service = BodyAnalysisService()
virtual_tryon_service = VirtualTryOnService()
recommendation_service = RecommendationService()

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-services"}

@app.post("/api/ai/body-analysis")
async def analyze_body(image: UploadFile = File(...)):
    """Analyze body landmarks and measurements from uploaded image"""
    try:
        image_data = await image.read()
        result = await body_analysis_service.analyze_body(image_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/virtual-tryon")
async def virtual_tryon(request: VirtualTryOnRequest):
    """Generate virtual try-on image"""
    try:
        result = await virtual_tryon_service.generate_tryon(
            user_image_url=request.user_image_url,
            product_image_url=request.product_image_url,
            body_landmarks=request.body_landmarks,
            product_metadata=request.product_metadata
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/size-recommendation")
async def recommend_size(request: SizeRecommendationRequest):
    """Recommend clothing size based on body measurements"""
    try:
        result = await recommendation_service.recommend_size(
            body_measurements=request.body_measurements,
            product_measurements=request.product_measurements,
            product_category=request.product_category
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/style-recommendation")
async def recommend_style(user_id: str, limit: int = 10):
    """Recommend clothing styles based on user preferences"""
    try:
        result = await recommendation_service.recommend_styles(
            user_id=user_id,
            limit=limit
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True
    )