/**
 * DEPRECATED COMPATIBILITY SHIM.
 *
 * The former local CCC issuance implementation has been quarantined under
 * src/services/legacy/. Production registry operations must use
 * AuthoritativeRegistryAdapter.
 *
 * This shim intentionally performs NO issuance and NEVER manufactures a
 * registry serial. It exists only so any stale call-site fails safe while the
 * remaining call-sites are migrated to the authoritative gateway.
 */
export class CCCRegistryService {
  static async registerVerifiedActivity(record: any, _verifierId: string): Promise<string> {
    // An MRV verification is not a statutory CCC issuance event. Preserve an
    // already-authoritative reference if one was supplied; otherwise return an
    // empty value rather than minting/fabricating a serial locally.
    return typeof record?.registry_serial_number === 'string'
      ? record.registry_serial_number
      : '';
  }
}
