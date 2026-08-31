/**
 * QUARANTINED LEGACY SERVICE — NOT PART OF THE PRODUCTION PATH.
 *
 * The former CCCRegistryService directly called /mint-ccc. The canonical
 * production registry boundary is AuthoritativeRegistryAdapter.
 * This implementation is retained temporarily for historical/reference
 * purposes only and must not be imported by production code.
 */
export class CCCRegistryService {
  static async registerVerifiedActivity(_record: any, _verifierId: string): Promise<string> {
    throw new Error('CCCRegistryService is quarantined; use AuthoritativeRegistryAdapter.');
  }
}
