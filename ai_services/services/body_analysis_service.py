import cv2
import mediapipe as mp
import numpy as np
from typing import Dict, List, Tuple
import io
from PIL import Image

class BodyAnalysisService:
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.mp_drawing = mp.solutions.drawing_utils
        self.pose = self.mp_pose.Pose(
            static_image_mode=True,
            model_complexity=2,
            enable_segmentation=True,
            min_detection_confidence=0.5
        )

    async def analyze_body(self, image_data: bytes) -> Dict:
        """Analyze body landmarks and calculate measurements"""
        try:
            # Convert bytes to PIL Image
            image = Image.open(io.BytesIO(image_data))
            image_rgb = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            
            # Process with MediaPipe
            results = self.pose.process(cv2.cvtColor(image_rgb, cv2.COLOR_BGR2RGB))
            
            if not results.pose_landmarks:
                raise ValueError("No body landmarks detected in the image")
            
            # Extract landmarks
            landmarks = self._extract_landmarks(results.pose_landmarks)
            
            # Calculate body measurements
            measurements = self._calculate_measurements(landmarks, image.size)
            
            # Determine body shape
            body_shape = self._classify_body_shape(measurements)
            
            return {
                "landmarks": landmarks,
                "measurements": measurements,
                "body_shape": body_shape,
                "confidence": self._calculate_confidence(results)
            }
            
        except Exception as e:
            raise Exception(f"Body analysis failed: {str(e)}")

    def _extract_landmarks(self, pose_landmarks) -> List[Dict]:
        """Extract pose landmarks as normalized coordinates"""
        landmarks = []
        for landmark in pose_landmarks.landmark:
            landmarks.append({
                "x": landmark.x,
                "y": landmark.y,
                "z": landmark.z,
                "visibility": landmark.visibility
            })
        return landmarks

    def _calculate_measurements(self, landmarks: List[Dict], image_size: Tuple[int, int]) -> Dict:
        """Calculate body measurements from landmarks"""
        width, height = image_size
        
        # Key landmark indices (MediaPipe pose landmarks)
        LEFT_SHOULDER = 11
        RIGHT_SHOULDER = 12
        LEFT_HIP = 23
        RIGHT_HIP = 24
        LEFT_KNEE = 25
        RIGHT_KNEE = 26
        LEFT_ANKLE = 27
        RIGHT_ANKLE = 28
        
        # Calculate distances in pixels, then convert to relative measurements
        shoulder_width = self._calculate_distance(
            landmarks[LEFT_SHOULDER], landmarks[RIGHT_SHOULDER], width, height
        )
        
        hip_width = self._calculate_distance(
            landmarks[LEFT_HIP], landmarks[RIGHT_HIP], width, height
        )
        
        # Estimate height from head to ankle
        body_height = self._calculate_distance(
            landmarks[0], landmarks[LEFT_ANKLE], width, height  # nose to ankle
        )
        
        # Estimate waist width (approximation between shoulders and hips)
        waist_width = (shoulder_width + hip_width) / 2 * 0.8  # rough estimation
        
        return {
            "shoulder_width_px": shoulder_width,
            "waist_width_px": waist_width,
            "hip_width_px": hip_width,
            "body_height_px": body_height,
            "shoulder_to_hip_ratio": shoulder_width / hip_width if hip_width > 0 else 1.0,
            "waist_to_hip_ratio": waist_width / hip_width if hip_width > 0 else 1.0
        }

    def _calculate_distance(self, point1: Dict, point2: Dict, width: int, height: int) -> float:
        """Calculate Euclidean distance between two landmarks"""
        x1, y1 = point1["x"] * width, point1["y"] * height
        x2, y2 = point2["x"] * width, point2["y"] * height
        return np.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

    def _classify_body_shape(self, measurements: Dict) -> str:
        """Classify body shape based on measurements"""
        shoulder_hip_ratio = measurements["shoulder_to_hip_ratio"]
        waist_hip_ratio = measurements["waist_to_hip_ratio"]
        
        if shoulder_hip_ratio > 1.05:
            return "inverted_triangle"
        elif shoulder_hip_ratio < 0.95:
            return "pear"
        elif waist_hip_ratio < 0.75:
            return "hourglass"
        elif waist_hip_ratio > 0.85:
            return "rectangle"
        else:
            return "apple"

    def _calculate_confidence(self, results) -> float:
        """Calculate confidence score based on landmark visibility"""
        if not results.pose_landmarks:
            return 0.0
        
        total_visibility = sum(landmark.visibility for landmark in results.pose_landmarks.landmark)
        return total_visibility / len(results.pose_landmarks.landmark)