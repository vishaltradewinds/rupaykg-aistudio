/**
 * DEPRECATED COMPATIBILITY SHIM.
 *
 * The former implementation has been quarantined under src/services/legacy/.
 * Production registry operations must use AuthoritativeRegistryAdapter.
 */
export class CCCRegistryService {
  static async registerVerifiedActivity(_record: any, _verifierId: string): Promise<string> {
    throw new Error('CCCRegistryService is quarantined; use AuthoritativeRegistryAdapter.');
  }
}
