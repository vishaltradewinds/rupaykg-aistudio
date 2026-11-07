# G-002 Live CPCB/SWM Compliance Adapter — 2026-11-07

Read-only Neon reconciliation confirms authoritative production structures for CPCB/SWM compliance:
- cpcb_swm_stakeholder_workspaces
- cpcb_swm_status_history
- organization_epr_applicability
- organization_bwg_assessments
- bwg_reporting_periods
- epr_returns

This batch implements tenant-scoped workspace/status, EPR applicability, and BWG assessment adapters. It uses the existing live organization boundary and identity fields. Legacy project_intakes/ccts_submissions are not recreated.

Production DB was not mutated.
