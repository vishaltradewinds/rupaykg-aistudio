import uuid
import datetime

class ONDCConnector:
    @staticmethod
    def create_listing(material: str, quantity_kg: float, price_inr: float, location: str):
        """
        Mocks pushing a listing to the Open Network for Digital Commerce (ONDC).
        """
        listing_id = f"ONDC-{uuid.uuid4().hex[:8].upper()}"
        
        payload = {
            "context": {
                "domain": "nic2004:900", # Sewage and refuse disposal, sanitation
                "country": "IND",
                "city": location,
                "action": "search",
                "core_version": "1.1.0",
                "bap_id": "rupaykg.dpi.in",
                "bap_uri": "https://rupaykg.dpi.in/ondc",
                "transaction_id": listing_id,
                "timestamp": datetime.datetime.utcnow().isoformat()
            },
            "message": {
                "intent": {
                    "item": {
                        "descriptor": {"name": material},
                        "quantity": {"amount": quantity_kg, "unit": "kg"},
                        "price": {"currency": "INR", "value": price_inr}
                    }
                }
            }
        }
        
        return {
            "status": "LISTED_ON_ONDC_NETWORK",
            "listing_id": listing_id,
            "network_payload": payload
        }
