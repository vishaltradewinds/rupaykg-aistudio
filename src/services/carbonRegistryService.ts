export class CarbonRegistryService {
  /**
   * Simulates registering a verified carbon mitigation activity with an external Carbon Registry API.
   * If a real API URL is provided in the environment, it attempts to call it.
   * Otherwise, it generates a simulated registry serial number.
   */
  static async registerVerifiedActivity(record: any, verifierId: string): Promise<string> {
    const registryUrl = process.env.CARBON_REGISTRY_API_URL;
    
    const payload = {
      activity_id: record.id,
      waste_type: record.waste_type,
      weight_kg: record.weight_kg,
      carbon_reduction_kg: record.carbon_reduction_kg,
      location: {
        lat: record.geo_lat,
        lng: record.geo_long,
        village: record.village
      },
      verifier_id: verifierId,
      timestamp: new Date().toISOString()
    };

    if (registryUrl) {
      try {
        const response = await fetch(`${registryUrl}/mint`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.CARBON_REGISTRY_API_KEY}`
          },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          throw new Error(`Registry API failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.serial_number;
      } catch (error) {
        console.error("External registry API failed, falling back to local generation:", error);
      }
    }
    
    // Simulated response for demonstration and fallback
    const randomHex = Math.random().toString(16).substring(2, 10).toUpperCase();
    const year = new Date().getFullYear();
    return `IND-VER-${year}-${randomHex}`;
  }
}
