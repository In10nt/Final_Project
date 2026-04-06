import requests
import json

# Test data
user_profile = {
    "measurements": {
        "chest_cm": 110,
        "waist_cm": 95,
        "hip_cm": 115,
        "height_cm": 175
    },
    "skin_tone": "medium",
    "body_shape": "apple",
    "gender": "female",
    "clothing_type": "shirt",
    "occasion": "casual"
}

print("Testing AI Service...")
print("=" * 60)
print("User Profile:")
print(json.dumps(user_profile, indent=2))
print("=" * 60)

# Call AI service
response = requests.post(
    "http://localhost:5000/api/ai/complete-recommendation",
    json=user_profile
)

print(f"\nStatus Code: {response.status_code}")
print("\nResponse:")
print(json.dumps(response.json(), indent=2))
