class MRVEngine:
    @staticmethod
    def calculate_emission_reduction(weight_kg: float, material_type: str) -> float:
        """
        Calculates the emission reduction in tCO2e based on material type and weight.
        """
        # Emission Factors (tCO2 per ton)
        FACTORS = {
            "plastic_recycling": 2.7,
            "biomass_diversion": 1.5,
            "organic_composting": 0.9,
            "metal_recycling": 4.5,
            "waste_to_energy": 1.2
        }
        
        tons = weight_kg / 1000.0
        factor = FACTORS.get(material_type, 0.5) # Default fallback factor
        
        return round(tons * factor, 4)
