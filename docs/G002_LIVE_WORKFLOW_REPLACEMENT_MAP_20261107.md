# G-002 Live Workflow Replacement Map — 2026-11-07

## Authoritative production model

The production database does not contain the legacy workflow tables used by the current repository ORM. The live model instead exposes organization-scoped operational primitives.

| Legacy repository workflow | Live production primitive | Tenant boundary |
|---|---|---|
| project intake | `activities`, evidence, verification/workspace structures | activity.organization_id |
| monitoring measurements | `measurements` -> `activities` | activity.organization_id |
| evidence chain | `evidence` + `evidence_artifact_series` + versions | activity / series organization_id |
| carbon calculation | `carbon_calculations` -> `carbon_projects` + activity | carbon_project.organization_id + activity.organization_id |
| verification | `verifications` -> activity/evidence + authorization membership/role | project/activity authorization lineage |
| carbon claims | `environmental_attribute_claims` | organization_id + activity_id |
| registry/credential lifecycle | `credentials`, `registry_events` | issuer/owner organization + activity/verification lineage |
| CCTS/SWM workflow | `cpcb_swm_stakeholder_workspaces`, reporting/verification structures | organization_id |

## Engineering decision

Do not recreate the missing legacy tables merely to preserve the old ORM.

The tenant conversion should move toward the live model and treat the old Phase-5 tables as legacy application artifacts until each domain is formally reconciled.

A first live-schema adapter has been added for:
- project scope resolution;
- project activities;
- project evidence;
- project carbon calculations.

All reads require the authoritative tenant context and verify the project organization before accessing child records.

## Safety

This is application-layer engineering only. Production schema, roles and RLS remain unchanged.

## Remaining gate

The full workflow migration still requires:
1. complete live-schema mapping for intake/eligibility, verification, CCTS/SWM, audit package and issue lifecycle;
2. write-path conversion with transaction-local tenant context;
3. two-organization A/B rehearsal;
4. CI/runtime authorization proof;
5. only then production RLS consideration.
