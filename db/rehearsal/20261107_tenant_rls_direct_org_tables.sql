-- RupayKg G-002 tenant-isolation rehearsal migration — NOT FOR PRODUCTION
-- This file is intentionally not executed automatically.
-- Preconditions:
--   1. migration authority reconciled;
--   2. runtime role is NOBYPASSRLS;
--   3. owner role is NOLOGIN/NOBYPASSRLS;
--   4. application transaction layer sets trusted LOCAL tenant context;
--   5. cross-organization transaction policies are separately approved.

BEGIN;

CREATE SCHEMA IF NOT EXISTS app;

CREATE OR REPLACE FUNCTION app.current_organization_id()
RETURNS uuid
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v text;
BEGIN
  v := current_setting('app.organization_id', true);
  IF v IS NULL OR btrim(v) = '' THEN
    RETURN NULL;
  END IF;
  BEGIN
    RETURN v::uuid;
  EXCEPTION WHEN invalid_text_representation THEN
    RETURN NULL;
  END;
END;
$$;

CREATE OR REPLACE FUNCTION app.current_identity_id()
RETURNS uuid
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v text;
BEGIN
  v := current_setting('app.identity_id', true);
  IF v IS NULL OR btrim(v) = '' THEN
    RETURN NULL;
  END IF;
  BEGIN
    RETURN v::uuid;
  EXCEPTION WHEN invalid_text_representation THEN
    RETURN NULL;
  END;
END;
$$;

-- Direct single-tenant tables.
-- Cross-organization tables (for example epr_credit_transfers) are deliberately
-- excluded until bilateral authorization semantics are separately tested.

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_activities_select ON public.activities;
CREATE POLICY tenant_activities_select ON public.activities FOR SELECT USING (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_activities_insert ON public.activities;
CREATE POLICY tenant_activities_insert ON public.activities FOR INSERT WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_activities_update ON public.activities;
CREATE POLICY tenant_activities_update ON public.activities FOR UPDATE USING (organization_id = app.current_organization_id()) WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_activities_delete ON public.activities;
CREATE POLICY tenant_activities_delete ON public.activities FOR DELETE USING (organization_id = app.current_organization_id());

ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_audit_events_select ON public.audit_events;
CREATE POLICY tenant_audit_events_select ON public.audit_events FOR SELECT USING (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_audit_events_insert ON public.audit_events;
CREATE POLICY tenant_audit_events_insert ON public.audit_events FOR INSERT WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_audit_events_update ON public.audit_events;
CREATE POLICY tenant_audit_events_update ON public.audit_events FOR UPDATE USING (organization_id = app.current_organization_id()) WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_audit_events_delete ON public.audit_events;
CREATE POLICY tenant_audit_events_delete ON public.audit_events FOR DELETE USING (organization_id = app.current_organization_id());

ALTER TABLE public.bwg_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_bwg_profiles_select ON public.bwg_profiles;
CREATE POLICY tenant_bwg_profiles_select ON public.bwg_profiles FOR SELECT USING (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_bwg_profiles_insert ON public.bwg_profiles;
CREATE POLICY tenant_bwg_profiles_insert ON public.bwg_profiles FOR INSERT WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_bwg_profiles_update ON public.bwg_profiles;
CREATE POLICY tenant_bwg_profiles_update ON public.bwg_profiles FOR UPDATE USING (organization_id = app.current_organization_id()) WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_bwg_profiles_delete ON public.bwg_profiles;
CREATE POLICY tenant_bwg_profiles_delete ON public.bwg_profiles FOR DELETE USING (organization_id = app.current_organization_id());

ALTER TABLE public.bwg_reporting_periods ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_bwg_reporting_periods_select ON public.bwg_reporting_periods;
CREATE POLICY tenant_bwg_reporting_periods_select ON public.bwg_reporting_periods FOR SELECT USING (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_bwg_reporting_periods_insert ON public.bwg_reporting_periods;
CREATE POLICY tenant_bwg_reporting_periods_insert ON public.bwg_reporting_periods FOR INSERT WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_bwg_reporting_periods_update ON public.bwg_reporting_periods;
CREATE POLICY tenant_bwg_reporting_periods_update ON public.bwg_reporting_periods FOR UPDATE USING (organization_id = app.current_organization_id()) WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_bwg_reporting_periods_delete ON public.bwg_reporting_periods;
CREATE POLICY tenant_bwg_reporting_periods_delete ON public.bwg_reporting_periods FOR DELETE USING (organization_id = app.current_organization_id());

ALTER TABLE public.carbon_projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_carbon_projects_select ON public.carbon_projects;
CREATE POLICY tenant_carbon_projects_select ON public.carbon_projects FOR SELECT USING (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_carbon_projects_insert ON public.carbon_projects;
CREATE POLICY tenant_carbon_projects_insert ON public.carbon_projects FOR INSERT WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_carbon_projects_update ON public.carbon_projects;
CREATE POLICY tenant_carbon_projects_update ON public.carbon_projects FOR UPDATE USING (organization_id = app.current_organization_id()) WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_carbon_projects_delete ON public.carbon_projects;
CREATE POLICY tenant_carbon_projects_delete ON public.carbon_projects FOR DELETE USING (organization_id = app.current_organization_id());

ALTER TABLE public.cpcb_swm_stakeholder_workspaces ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_cpcb_swm_stakeholder_workspaces_select ON public.cpcb_swm_stakeholder_workspaces;
CREATE POLICY tenant_cpcb_swm_stakeholder_workspaces_select ON public.cpcb_swm_stakeholder_workspaces FOR SELECT USING (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_cpcb_swm_stakeholder_workspaces_insert ON public.cpcb_swm_stakeholder_workspaces;
CREATE POLICY tenant_cpcb_swm_stakeholder_workspaces_insert ON public.cpcb_swm_stakeholder_workspaces FOR INSERT WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_cpcb_swm_stakeholder_workspaces_update ON public.cpcb_swm_stakeholder_workspaces;
CREATE POLICY tenant_cpcb_swm_stakeholder_workspaces_update ON public.cpcb_swm_stakeholder_workspaces FOR UPDATE USING (organization_id = app.current_organization_id()) WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_cpcb_swm_stakeholder_workspaces_delete ON public.cpcb_swm_stakeholder_workspaces;
CREATE POLICY tenant_cpcb_swm_stakeholder_workspaces_delete ON public.cpcb_swm_stakeholder_workspaces FOR DELETE USING (organization_id = app.current_organization_id());

ALTER TABLE public.cpcb_swm_status_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_cpcb_swm_status_history_select ON public.cpcb_swm_status_history;
CREATE POLICY tenant_cpcb_swm_status_history_select ON public.cpcb_swm_status_history FOR SELECT USING (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_cpcb_swm_status_history_insert ON public.cpcb_swm_status_history;
CREATE POLICY tenant_cpcb_swm_status_history_insert ON public.cpcb_swm_status_history FOR INSERT WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_cpcb_swm_status_history_update ON public.cpcb_swm_status_history;
CREATE POLICY tenant_cpcb_swm_status_history_update ON public.cpcb_swm_status_history FOR UPDATE USING (organization_id = app.current_organization_id()) WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_cpcb_swm_status_history_delete ON public.cpcb_swm_status_history;
CREATE POLICY tenant_cpcb_swm_status_history_delete ON public.cpcb_swm_status_history FOR DELETE USING (organization_id = app.current_organization_id());

ALTER TABLE public.environmental_attribute_claims ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_environmental_attribute_claims_select ON public.environmental_attribute_claims;
CREATE POLICY tenant_environmental_attribute_claims_select ON public.environmental_attribute_claims FOR SELECT USING (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_environmental_attribute_claims_insert ON public.environmental_attribute_claims;
CREATE POLICY tenant_environmental_attribute_claims_insert ON public.environmental_attribute_claims FOR INSERT WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_environmental_attribute_claims_update ON public.environmental_attribute_claims;
CREATE POLICY tenant_environmental_attribute_claims_update ON public.environmental_attribute_claims FOR UPDATE USING (organization_id = app.current_organization_id()) WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_environmental_attribute_claims_delete ON public.environmental_attribute_claims;
CREATE POLICY tenant_environmental_attribute_claims_delete ON public.environmental_attribute_claims FOR DELETE USING (organization_id = app.current_organization_id());

ALTER TABLE public.epr_returns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_epr_returns_select ON public.epr_returns;
CREATE POLICY tenant_epr_returns_select ON public.epr_returns FOR SELECT USING (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_epr_returns_insert ON public.epr_returns;
CREATE POLICY tenant_epr_returns_insert ON public.epr_returns FOR INSERT WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_epr_returns_update ON public.epr_returns;
CREATE POLICY tenant_epr_returns_update ON public.epr_returns FOR UPDATE USING (organization_id = app.current_organization_id()) WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_epr_returns_delete ON public.epr_returns;
CREATE POLICY tenant_epr_returns_delete ON public.epr_returns FOR DELETE USING (organization_id = app.current_organization_id());

ALTER TABLE public.esg_reporting_periods ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_esg_reporting_periods_select ON public.esg_reporting_periods;
CREATE POLICY tenant_esg_reporting_periods_select ON public.esg_reporting_periods FOR SELECT USING (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_esg_reporting_periods_insert ON public.esg_reporting_periods;
CREATE POLICY tenant_esg_reporting_periods_insert ON public.esg_reporting_periods FOR INSERT WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_esg_reporting_periods_update ON public.esg_reporting_periods;
CREATE POLICY tenant_esg_reporting_periods_update ON public.esg_reporting_periods FOR UPDATE USING (organization_id = app.current_organization_id()) WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_esg_reporting_periods_delete ON public.esg_reporting_periods;
CREATE POLICY tenant_esg_reporting_periods_delete ON public.esg_reporting_periods FOR DELETE USING (organization_id = app.current_organization_id());

ALTER TABLE public.evidence_artifact_series ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_evidence_artifact_series_select ON public.evidence_artifact_series;
CREATE POLICY tenant_evidence_artifact_series_select ON public.evidence_artifact_series FOR SELECT USING (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_evidence_artifact_series_insert ON public.evidence_artifact_series;
CREATE POLICY tenant_evidence_artifact_series_insert ON public.evidence_artifact_series FOR INSERT WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_evidence_artifact_series_update ON public.evidence_artifact_series;
CREATE POLICY tenant_evidence_artifact_series_update ON public.evidence_artifact_series FOR UPDATE USING (organization_id = app.current_organization_id()) WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_evidence_artifact_series_delete ON public.evidence_artifact_series;
CREATE POLICY tenant_evidence_artifact_series_delete ON public.evidence_artifact_series FOR DELETE USING (organization_id = app.current_organization_id());

ALTER TABLE public.field_devices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_field_devices_select ON public.field_devices;
CREATE POLICY tenant_field_devices_select ON public.field_devices FOR SELECT USING (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_field_devices_insert ON public.field_devices;
CREATE POLICY tenant_field_devices_insert ON public.field_devices FOR INSERT WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_field_devices_update ON public.field_devices;
CREATE POLICY tenant_field_devices_update ON public.field_devices FOR UPDATE USING (organization_id = app.current_organization_id()) WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_field_devices_delete ON public.field_devices;
CREATE POLICY tenant_field_devices_delete ON public.field_devices FOR DELETE USING (organization_id = app.current_organization_id());

ALTER TABLE public.obligations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_obligations_select ON public.obligations;
CREATE POLICY tenant_obligations_select ON public.obligations FOR SELECT USING (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_obligations_insert ON public.obligations;
CREATE POLICY tenant_obligations_insert ON public.obligations FOR INSERT WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_obligations_update ON public.obligations;
CREATE POLICY tenant_obligations_update ON public.obligations FOR UPDATE USING (organization_id = app.current_organization_id()) WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_obligations_delete ON public.obligations;
CREATE POLICY tenant_obligations_delete ON public.obligations FOR DELETE USING (organization_id = app.current_organization_id());

ALTER TABLE public.organization_bwg_assessments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_organization_bwg_assessments_select ON public.organization_bwg_assessments;
CREATE POLICY tenant_organization_bwg_assessments_select ON public.organization_bwg_assessments FOR SELECT USING (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_organization_bwg_assessments_insert ON public.organization_bwg_assessments;
CREATE POLICY tenant_organization_bwg_assessments_insert ON public.organization_bwg_assessments FOR INSERT WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_organization_bwg_assessments_update ON public.organization_bwg_assessments;
CREATE POLICY tenant_organization_bwg_assessments_update ON public.organization_bwg_assessments FOR UPDATE USING (organization_id = app.current_organization_id()) WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_organization_bwg_assessments_delete ON public.organization_bwg_assessments;
CREATE POLICY tenant_organization_bwg_assessments_delete ON public.organization_bwg_assessments FOR DELETE USING (organization_id = app.current_organization_id());

ALTER TABLE public.organization_epr_applicability ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_organization_epr_applicability_select ON public.organization_epr_applicability;
CREATE POLICY tenant_organization_epr_applicability_select ON public.organization_epr_applicability FOR SELECT USING (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_organization_epr_applicability_insert ON public.organization_epr_applicability;
CREATE POLICY tenant_organization_epr_applicability_insert ON public.organization_epr_applicability FOR INSERT WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_organization_epr_applicability_update ON public.organization_epr_applicability;
CREATE POLICY tenant_organization_epr_applicability_update ON public.organization_epr_applicability FOR UPDATE USING (organization_id = app.current_organization_id()) WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_organization_epr_applicability_delete ON public.organization_epr_applicability;
CREATE POLICY tenant_organization_epr_applicability_delete ON public.organization_epr_applicability FOR DELETE USING (organization_id = app.current_organization_id());

ALTER TABLE public.organization_geography_scopes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_organization_geography_scopes_select ON public.organization_geography_scopes;
CREATE POLICY tenant_organization_geography_scopes_select ON public.organization_geography_scopes FOR SELECT USING (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_organization_geography_scopes_insert ON public.organization_geography_scopes;
CREATE POLICY tenant_organization_geography_scopes_insert ON public.organization_geography_scopes FOR INSERT WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_organization_geography_scopes_update ON public.organization_geography_scopes;
CREATE POLICY tenant_organization_geography_scopes_update ON public.organization_geography_scopes FOR UPDATE USING (organization_id = app.current_organization_id()) WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_organization_geography_scopes_delete ON public.organization_geography_scopes;
CREATE POLICY tenant_organization_geography_scopes_delete ON public.organization_geography_scopes FOR DELETE USING (organization_id = app.current_organization_id());

ALTER TABLE public.organization_statutory_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_organization_statutory_profiles_select ON public.organization_statutory_profiles;
CREATE POLICY tenant_organization_statutory_profiles_select ON public.organization_statutory_profiles FOR SELECT USING (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_organization_statutory_profiles_insert ON public.organization_statutory_profiles;
CREATE POLICY tenant_organization_statutory_profiles_insert ON public.organization_statutory_profiles FOR INSERT WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_organization_statutory_profiles_update ON public.organization_statutory_profiles;
CREATE POLICY tenant_organization_statutory_profiles_update ON public.organization_statutory_profiles FOR UPDATE USING (organization_id = app.current_organization_id()) WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_organization_statutory_profiles_delete ON public.organization_statutory_profiles;
CREATE POLICY tenant_organization_statutory_profiles_delete ON public.organization_statutory_profiles FOR DELETE USING (organization_id = app.current_organization_id());

ALTER TABLE public.organization_verification_evidence ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_organization_verification_evidence_select ON public.organization_verification_evidence;
CREATE POLICY tenant_organization_verification_evidence_select ON public.organization_verification_evidence FOR SELECT USING (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_organization_verification_evidence_insert ON public.organization_verification_evidence;
CREATE POLICY tenant_organization_verification_evidence_insert ON public.organization_verification_evidence FOR INSERT WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_organization_verification_evidence_update ON public.organization_verification_evidence;
CREATE POLICY tenant_organization_verification_evidence_update ON public.organization_verification_evidence FOR UPDATE USING (organization_id = app.current_organization_id()) WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_organization_verification_evidence_delete ON public.organization_verification_evidence;
CREATE POLICY tenant_organization_verification_evidence_delete ON public.organization_verification_evidence FOR DELETE USING (organization_id = app.current_organization_id());

ALTER TABLE public.platform_access_change_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_platform_access_change_requests_select ON public.platform_access_change_requests;
CREATE POLICY tenant_platform_access_change_requests_select ON public.platform_access_change_requests FOR SELECT USING (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_platform_access_change_requests_insert ON public.platform_access_change_requests;
CREATE POLICY tenant_platform_access_change_requests_insert ON public.platform_access_change_requests FOR INSERT WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_platform_access_change_requests_update ON public.platform_access_change_requests;
CREATE POLICY tenant_platform_access_change_requests_update ON public.platform_access_change_requests FOR UPDATE USING (organization_id = app.current_organization_id()) WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_platform_access_change_requests_delete ON public.platform_access_change_requests;
CREATE POLICY tenant_platform_access_change_requests_delete ON public.platform_access_change_requests FOR DELETE USING (organization_id = app.current_organization_id());

ALTER TABLE public.resource_flows ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_resource_flows_select ON public.resource_flows;
CREATE POLICY tenant_resource_flows_select ON public.resource_flows FOR SELECT USING (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_resource_flows_insert ON public.resource_flows;
CREATE POLICY tenant_resource_flows_insert ON public.resource_flows FOR INSERT WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_resource_flows_update ON public.resource_flows;
CREATE POLICY tenant_resource_flows_update ON public.resource_flows FOR UPDATE USING (organization_id = app.current_organization_id()) WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_resource_flows_delete ON public.resource_flows;
CREATE POLICY tenant_resource_flows_delete ON public.resource_flows FOR DELETE USING (organization_id = app.current_organization_id());

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_roles_select ON public.roles;
CREATE POLICY tenant_roles_select ON public.roles FOR SELECT USING (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_roles_insert ON public.roles;
CREATE POLICY tenant_roles_insert ON public.roles FOR INSERT WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_roles_update ON public.roles;
CREATE POLICY tenant_roles_update ON public.roles FOR UPDATE USING (organization_id = app.current_organization_id()) WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_roles_delete ON public.roles;
CREATE POLICY tenant_roles_delete ON public.roles FOR DELETE USING (organization_id = app.current_organization_id());

ALTER TABLE public.stakeholder_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_stakeholder_applications_select ON public.stakeholder_applications;
CREATE POLICY tenant_stakeholder_applications_select ON public.stakeholder_applications FOR SELECT USING (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_stakeholder_applications_insert ON public.stakeholder_applications;
CREATE POLICY tenant_stakeholder_applications_insert ON public.stakeholder_applications FOR INSERT WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_stakeholder_applications_update ON public.stakeholder_applications;
CREATE POLICY tenant_stakeholder_applications_update ON public.stakeholder_applications FOR UPDATE USING (organization_id = app.current_organization_id()) WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_stakeholder_applications_delete ON public.stakeholder_applications;
CREATE POLICY tenant_stakeholder_applications_delete ON public.stakeholder_applications FOR DELETE USING (organization_id = app.current_organization_id());

-- Membership is additionally constrained by the authenticated identity.
ALTER TABLE public.organization_memberships ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_organization_memberships_select ON public.organization_memberships;
CREATE POLICY tenant_organization_memberships_select ON public.organization_memberships FOR SELECT USING (organization_id = app.current_organization_id() AND identity_id = app.current_identity_id());
DROP POLICY IF EXISTS tenant_organization_memberships_insert ON public.organization_memberships;
CREATE POLICY tenant_organization_memberships_insert ON public.organization_memberships FOR INSERT WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_organization_memberships_update ON public.organization_memberships;
CREATE POLICY tenant_organization_memberships_update ON public.organization_memberships FOR UPDATE USING (organization_id = app.current_organization_id()) WITH CHECK (organization_id = app.current_organization_id());
DROP POLICY IF EXISTS tenant_organization_memberships_delete ON public.organization_memberships;
CREATE POLICY tenant_organization_memberships_delete ON public.organization_memberships FOR DELETE USING (organization_id = app.current_organization_id());

COMMIT;
