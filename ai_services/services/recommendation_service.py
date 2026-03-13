from typing import Dict, List, Any
import asyncio

class RecommendationService:
    def __init__(self):
        self.size_mapping = {
            "XS": {"chest": 86, "waist": 70, "hip": 90},
            "S": {"chest": 90, "waist": 74, "hip": 94},
            "M": {"chest": 94, "waist": 78, "hip": 98},
            "L": {"chest": 98, "waist": 82, "hip": 102},
            "XL": {"chest": 102, "waist": 86, "hip": 106},
            "XXL": {"chest": 106, "waist": 90, "hip": 110}
        }

    async def recommend_size(
        self,
        body_measurements: Dict[str, float],
        product_measurements: Dict[str, Dict[str, float]],
        product_category: str
    ) -> Dict[str, Any]:
        """Recommend clothing size based on body measurements"""
        try:
            # Simulate processing time
            await asyncio.sleep(0.5)
            
            best_size = self._find_best_size(body_measurements, product_measurements)
            confidence = self._calculate_confidence(body_measurements, product_measurements, best_size)
            
            result = {
                "recommended_size": best_size,
                "confidence": confidence,
                "reasoning": f"Based on your measurements, size {best_size} provides the best fit",
                "alternative_sizes": self._get_alternative_sizes(body_measurements, product_measurements),
                "fit_notes": self._generate_fit_notes(body_measurements, best_size)
            }
            
            return result
            
        except Exception as e:
            raise Exception(f"Size recommendation failed: {str(e)}")

    async def recommend_styles(
        self,
        user_id: str,
        limit: int = 10
    ) -> Dict[str, Any]:
        """Recommend clothing styles based on user preferences"""
        try:
            # Simulate processing time
            await asyncio.sleep(1)
            
            # Mock recommendations
            recommendations = [
                {
                    "product_id": f"product_{i}",
                    "name": f"Recommended Item {i}",
                    "category": "shirts" if i % 2 == 0 else "pants",
                    "confidence": 0.9 - (i * 0.05),
                    "reason": "Matches your style preferences"
                }
                for i in range(1, limit + 1)
            ]
            
            return {
                "recommendations": recommendations,
                "total_count": len(recommendations),
                "user_id": user_id
            }
            
        except Exception as e:
            raise Exception(f"Style recommendation failed: {str(e)}")

    def _find_best_size(
        self,
        body_measurements: Dict[str, float],
        product_measurements: Dict[str, Dict[str, float]]
    ) -> str:
        """Find the best fitting size"""
        best_size = "M"
        min_difference = float('inf')
        
        user_chest = body_measurements.get("chest", 94)
        user_waist = body_measurements.get("waist", 78)
        
        for size, measurements in product_measurements.items():
            chest_diff = abs(measurements.get("chest", 94) - user_chest)
            waist_diff = abs(measurements.get("waist", 78) - user_waist)
            total_diff = chest_diff + waist_diff
            
            if total_diff < min_difference:
                min_difference = total_diff
                best_size = size
        
        return best_size

    def _calculate_confidence(
        self,
        body_measurements: Dict[str, float],
        product_measurements: Dict[str, Dict[str, float]],
        recommended_size: str
    ) -> float:
        """Calculate confidence score for the recommendation"""
        # Simple confidence calculation based on measurement differences
        if recommended_size not in product_measurements:
            return 0.5
        
        user_chest = body_measurements.get("chest", 94)
        product_chest = product_measurements[recommended_size].get("chest", 94)
        
        difference = abs(user_chest - product_chest)
        
        if difference <= 2:
            return 0.95
        elif difference <= 4:
            return 0.85
        elif difference <= 6:
            return 0.75
        else:
            return 0.65

    def _get_alternative_sizes(
        self,
        body_measurements: Dict[str, float],
        product_measurements: Dict[str, Dict[str, float]]
    ) -> List[Dict[str, Any]]:
        """Get alternative size recommendations"""
        alternatives = []
        sizes = list(product_measurements.keys())
        
        for size in sizes[:2]:  # Return top 2 alternatives
            if size != self._find_best_size(body_measurements, product_measurements):
                alternatives.append({
                    "size": size,
                    "confidence": self._calculate_confidence(body_measurements, product_measurements, size),
                    "fit_type": "loose" if size in ["L", "XL"] else "snug"
                })
        
        return alternatives

    def _generate_fit_notes(self, body_measurements: Dict[str, float], size: str) -> List[str]:
        """Generate fit notes for the recommended size"""
        notes = []
        
        if size in ["XS", "S"]:
            notes.append("This size will provide a snug, fitted look")
        elif size in ["M"]:
            notes.append("This size offers a comfortable, regular fit")
        elif size in ["L", "XL"]:
            notes.append("This size will give you a relaxed, loose fit")
        
        notes.append("Consider your preferred fit style when making your choice")
        
        return notes