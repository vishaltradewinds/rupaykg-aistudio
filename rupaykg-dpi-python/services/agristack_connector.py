class AgriStackConnector:
    @staticmethod
    def fetch_farmer_data(farmer_id: str):
        """
        Mocks a connection to the National AgriStack DPI.
        """
        return {
            "farmer_id": farmer_id,
            "verification_status": "VERIFIED",
            "kyc_status": "COMPLETED",
            "land_parcels": [
                {
                    "parcel_id": f"LP-{farmer_id}-01",
                    "area_hectares": 2.4,
                    "primary_crop": "Wheat",
                    "geo_coordinates": {"lat": 28.6139, "lng": 77.2090}
                }
            ]
        }
