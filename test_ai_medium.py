import requests
import json

# Test with medium measurements
user_profile = {
    "measurements": {
        "chest_cm": 88,
        "waist_cm": 72,
        "hip_cm": 95,
        "height_cm": 165
    },
    "skin_tone": "medium",
    "body_shape": "rectangle",
    "gender": "female",
    "clothing_type": "shirt",
    "occasion": "casual"
}

print("Testing AI Service with MEDIUM measurements...")
print("=" * 60)

response = requests.post(
    "http://localhost:5000/api/ai/complete-recommendation",
    json=user_profile
)

result = response.json()
size_rec = result.get('size_recommendation', {})

print(f"Recommended Size: {size_rec.get('recommended_size')}")
print(f"Confidence: {size_rec.get('confidence')}%")
print(f"Alternatives: {size_rec.get('alternatives')}")
