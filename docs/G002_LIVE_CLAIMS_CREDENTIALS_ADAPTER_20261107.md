# G-002 Live Claims & Credentials Adapter — 2026-11-07

The live production model uses:
- environmental_attribute_claims for environmental claims;
- credentials for issued/eligible credentials;
- registry_events for registry lifecycle events.

Both adapters enforce organization ownership through the authoritative organization and activity lineage. Legacy carbon_claims/certificates are not recreated.

Production DB was not mutated. Activation remains gated by migration authority, runtime role, RLS rehearsal and two-organization isolation evidence.
