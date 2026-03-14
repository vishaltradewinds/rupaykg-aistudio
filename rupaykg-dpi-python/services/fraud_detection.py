import math

class FraudDetectionService:
    @staticmethod
    def detect_anomalies(user_id: str, weight_kg: float, lat: float, lng: float):
        """
        AI Fraud Detection Stub
        Detects impossible quantities or rapid geographic jumps.
        """
        # Rule 1: Impossible quantity for a single household/generator
        if weight_kg > 5000:
            return True, "Impossible waste quantity for single transaction (>5000kg)"
            
        # Rule 2: Location bounds check (Must be within India roughly)
        if not (8.0 < lat < 37.0) or not (68.0 < lng < 97.0):
            return True, "Location anomaly: Coordinates outside national boundaries"
            
        return False, "Valid"

    @staticmethod
    def verify_activity_location(lat: float, lng: float, expected_lat: float = 20.0, expected_lng: float = 77.0) -> bool:
        """
        Satellite Verification Service Stub
        Verifies if the reported GPS matches the expected zone/satellite imagery analysis.
        """
        # 100-meter threshold calculation (simplified Euclidean for stub)
        distance = math.sqrt((lat - expected_lat)**2 + (lng - expected_lng)**2)
        return distance < 0.001  # Roughly 100 meters
