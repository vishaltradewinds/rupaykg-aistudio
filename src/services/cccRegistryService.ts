export class CCCRegistryService {
  /**
   * Registers a verified activity with the authoritative CCC registry adapter.
   * RupayKg never fabricates CCC serial numbers. If the authoritative registry
   * is unavailable or unconfigured, the operation fails closed.
   */
  static async registerVerifiedActivity(record: any, verifierId: string): Promise<string> {
    const registryUrl = process.env.CCC_REGISTRY_API_URL;
    const registryApiKey = process.env.CCC_REGISTRY_API_KEY;

    if (!registryUrl || !registryApiKey) {
      throw new Error('CCC registry unavailable: authoritative registry credentials are not configured');
    }

    const payload = {
      activity_id: record.id,
      waste_type: record.waste_type,
      weight_kg: record.weight_kg,
      ccc_reduction_kg: record.ccc_reduction_kg,
      double_counting_safeguard: record.double_counting_declaration,
      market_type: 'OFFSET_MARKET',
      location: {
        lat: record.geo_lat,
        lng: record.geo_long,
        village: record.village
      },
      verifier_id: verifierId,
      timestamp: new Date().toISOString()
    };

    const response = await fetch(`${registryUrl.replace(/\/$/, '')}/mint-ccc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${registryApiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Authoritative CCC registry failed with status: ${response.status}`);
    }

    const data = await response.json();
    if (!data?.serial_number || typeof data.serial_number !== 'string') {
      throw new Error('Authoritative CCC registry returned no valid serial number');
    }

    return data.serial_number;
  }
}
