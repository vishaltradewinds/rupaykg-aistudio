# RupayKg Live Schema Baseline Scope — 2026-11-07

## Gate
G-002 — migration authority / database reproducibility.

## Live baseline
Neon production project `rupaykg-production-fresh` (`steep-mud-79906940`), primary branch `main` (`br-restless-base-b44cip2h`), database `rupaykg`, PostgreSQL 18.

Observed: 67 public base tables; 23 tables contain `organization_id`; 0 public RLS policies; all inspected public tables currently have RLS disabled and not forced.

## Tenant-scope classification
The 23 explicit organization-scoped tables are:

`activities`, `audit_events`, `bwg_profiles`, `bwg_reporting_periods`, `carbon_projects`, `cpcb_swm_stakeholder_workspaces`, `cpcb_swm_status_history`, `environmental_attribute_claims`, `epr_returns`, `esg_reporting_periods`, `evidence_artifact_series`, `field_devices`, `obligations`, `organization_bwg_assessments`, `organization_epr_applicability`, `organization_geography_scopes`, `organization_memberships`, `organization_statutory_profiles`, `organization_verification_evidence`, `platform_access_change_requests`, `resource_flows`, `roles`, `stakeholder_applications`.

This list is a scope signal, not yet an authorization decision. Tables without `organization_id` may still require indirect tenant isolation through foreign keys or controlled access paths.

## Required next baseline artifacts
1. Full schema snapshot: tables, columns, types, defaults, constraints, indexes, sequences, enums, functions, triggers, extensions and RLS state.
2. SHA-256 hash of the canonical snapshot.
3. Immutable copy of the 92-row `public.schema_migrations` ledger.
4. Mapping of each production ledger entry to recovered repository SQL where evidence exists.
5. Explicit missing-history inventory.
6. Canonical forward migration baseline generated only after the snapshot is reviewed.

## Safety rule
No production migration, RLS enablement, role mutation, or destructive schema operation is permitted merely to make repository state appear consistent with production. G-002 remains blocking until the baseline is reproducible and the migration authority is singular.
