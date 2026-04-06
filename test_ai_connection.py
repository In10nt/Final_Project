import requests
import json

print("Testing AI Service Connection...")
print("=" * 60)

# Test 1: Large measurements (should be XXL)
print("\nTest 1: Large measurements (Chest 110cm)")
response1 = requests.post(
    "http://localhost:5000/api/ai/recommend-size",
    json={
        "measurements": {
            "chest_cm": 110,
            "waist_cm": 95,
            "hip_cm": 115,
            "height_cm": 175
        },
        "gender": "female",
        "clothing_type": "shirt"
    }
)
result1 = response1.json()
print(f"Recommended Size: {result1['recommendation']['recommended_size']}")
print(f"Confidence: {result1['recommendation']['confidence']}%")

# Test 2: Small measurements (should be S)
print("\nTest 2: Small measurements (Chest 82cm)")
response2 = requests.post(
    "http://localhost:5000/api/ai/recommend-size",
    json={
        "measurements": {
            "chest_cm": 82,
            "waist_cm": 66,
            "hip_cm": 90,
            "height_cm": 160
        },
        "gender": "female",
        "clothing_type": "shirt"
    }
)
result2 = response2.json()
print(f"Recommended Size: {result2['recommendation']['recommended_size']}")
print(f"Confidence: {result2['recommendation']['confidence']}%")

# Test 3: Test through Java backend
print("\n" + "=" * 60)
print("Testing through Java Backend...")
print("=" * 60)

try:
    response3 = requests.post(
        "http://localhost:8082/api/ai/complete-recommendations",
        json={
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
    )
    result3 = response3.json()
    print(f"Success: {result3.get('success')}")
    if 'size_recommendation' in result3:
        print(f"Recommended Size: {result3['size_recommendation'].get('recommended_size')}")
        print(f"Confidence: {result3['size_recommendation'].get('confidence')}%")
    else:
        print("Response:", json.dumps(result3, indent=2))
except Exception as e:
    print(f"Error: {e}")

print("\n" + "=" * 60)
print("✓ Tests Complete")
print("=" * 60)
