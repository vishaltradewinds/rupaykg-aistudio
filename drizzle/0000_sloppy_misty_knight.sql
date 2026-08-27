CREATE TABLE "acva_appointments" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"acva_registry_id" text NOT NULL,
	"selection_reason" text NOT NULL,
	"conflict_declaration_passed" boolean DEFAULT true NOT NULL,
	"appointment_status" text DEFAULT 'PROPOSED' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "acva_cases" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"auditor_id" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "acva_engagements" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text,
	"cpa_id" text,
	"type" text DEFAULT 'VALIDATION' NOT NULL,
	"acva_organisation" text,
	"status" text DEFAULT 'NOT_STARTED' NOT NULL,
	"engagement_date" timestamp,
	"scope" text,
	"report" text,
	"findings" jsonb DEFAULT '[]'::jsonb,
	"corrective_actions" jsonb DEFAULT '[]'::jsonb,
	"final_opinion" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "acva_registry" (
	"id" text PRIMARY KEY NOT NULL,
	"agency_name" text NOT NULL,
	"accreditation_number" text NOT NULL,
	"accreditation_type" text NOT NULL,
	"mechanism" text DEFAULT 'CCTS_OFFSET' NOT NULL,
	"sector" text DEFAULT 'WASTE_HANDLING_AND_DISPOSAL' NOT NULL,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"valid_from" timestamp,
	"valid_to" timestamp,
	"source_url" text,
	"source_hash" text,
	"last_refreshed_at" timestamp DEFAULT now(),
	CONSTRAINT "acva_registry_accreditation_number_unique" UNIQUE("accreditation_number")
);
--> statement-breakpoint
CREATE TABLE "audit_packages" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"monitoring_period_id" text,
	"package_hash" text NOT NULL,
	"download_url" text,
	"included_entities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"generated_at" timestamp DEFAULT now(),
	"generated_by" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bee_methodologies" (
	"id" text PRIMARY KEY NOT NULL,
	"official_code" text NOT NULL,
	"official_title" text NOT NULL,
	"version" text NOT NULL,
	"methodology_type" text,
	"applicability" text,
	"source_document" text,
	"source_url" text,
	"publication_date" timestamp,
	"effective_date" timestamp,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"calculation_reference" text,
	"monitoring_requirements" jsonb,
	"evidence_requirements" jsonb,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "blockchain_blocks" (
	"id" text PRIMARY KEY NOT NULL,
	"block_index" integer NOT NULL,
	"previous_hash" text NOT NULL,
	"hash" text NOT NULL,
	"data" jsonb NOT NULL,
	"timestamp" timestamp DEFAULT now(),
	CONSTRAINT "blockchain_blocks_block_index_unique" UNIQUE("block_index")
);
--> statement-breakpoint
CREATE TABLE "calculation_datasets" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"monitoring_period_id" text NOT NULL,
	"dataset_hash" text NOT NULL,
	"status" text DEFAULT 'LOCKED' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "calculation_runs" (
	"id" text PRIMARY KEY NOT NULL,
	"dataset_id" text NOT NULL,
	"methodology_version_id" text NOT NULL,
	"formula_version" text NOT NULL,
	"status" text DEFAULT 'CALCULATED' NOT NULL,
	"result_tco2e" double precision NOT NULL,
	"calculation_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "calibrations" (
	"id" text PRIMARY KEY NOT NULL,
	"instrument_id" text NOT NULL,
	"calibration_date" timestamp NOT NULL,
	"expiry_date" timestamp NOT NULL,
	"certificate_url" text,
	"certificate_hash" text
);
--> statement-breakpoint
CREATE TABLE "carbon_claims" (
	"id" text PRIMARY KEY NOT NULL,
	"calculation_run_id" text NOT NULL,
	"status" text DEFAULT 'PENDING_VERIFICATION' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "carbon_events" (
	"id" text PRIMARY KEY NOT NULL,
	"record_id" text,
	"event_type" text NOT NULL,
	"amount_tco2e" double precision NOT NULL,
	"status" text DEFAULT 'RECORDED' NOT NULL,
	"stakeholder_chain" jsonb,
	"methodology_code" text,
	"evidence_hash" text,
	"village" text,
	"district" text,
	"state" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "carbon_programmes" (
	"id" text PRIMARY KEY NOT NULL,
	"icm_account_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"programme_type" text DEFAULT 'PoA' NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"geographical_scope" text,
	"technology_scope" text,
	"methodology_scope" text,
	"baseline_approach" text,
	"additionality_approach" text,
	"start_date" timestamp,
	"crediting_period_years" integer,
	"pdd_document" text,
	"registration_status" text DEFAULT 'INTERNAL' NOT NULL,
	"icm_reference" text,
	"validation_status" text,
	"verification_status" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "carbon_projects" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"owner_id" text NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"methodology_id" text,
	"waste_source_record_id" text,
	"icm_account_id" text,
	"programme_id" text,
	"generic_cpa_id" text,
	"cpa_id" text,
	"legal_entity_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "carbon_rights" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text,
	"cpa_id" text,
	"rights_holder_entity_id" text NOT NULL,
	"asset_owner_entity_id" text,
	"operator_entity_id" text,
	"beneficiary_entity_id" text,
	"ownership_percentage" numeric NOT NULL,
	"rights_type" text NOT NULL,
	"agreement_reference" text,
	"agreement_document" text,
	"effective_date" timestamp,
	"expiry_date" timestamp,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ccts_submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"submission_type" text NOT NULL,
	"monitoring_period_id" text,
	"acva_id" text,
	"documents" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"verification_report_url" text,
	"submission_date" timestamp DEFAULT now(),
	"external_reference" text,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"adapter_type" text DEFAULT 'MANUAL' NOT NULL,
	"response" jsonb,
	"audit_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "certificates" (
	"id" text PRIMARY KEY NOT NULL,
	"carbon_claim_id" text NOT NULL,
	"serial_number" text NOT NULL,
	"official_certificate_identifier" text,
	"external_reference" text,
	"status" text DEFAULT 'CALCULATED' NOT NULL,
	"issue_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "certificates_serial_number_unique" UNIQUE("serial_number")
);
--> statement-breakpoint
CREATE TABLE "compliance_records" (
	"id" text PRIMARY KEY NOT NULL,
	"entity_id" text,
	"compliance_type" text NOT NULL,
	"reporting_period" text,
	"status" text DEFAULT 'COMPLIANT' NOT NULL,
	"target_quantity" double precision,
	"achieved_quantity" double precision,
	"evidence_urls" jsonb,
	"verified_by" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "component_project_activities" (
	"id" text PRIMARY KEY NOT NULL,
	"generic_cpa_id" text NOT NULL,
	"project_id" text,
	"name" text NOT NULL,
	"operator_entity_id" text,
	"site_id" text,
	"geographical_boundary" jsonb,
	"start_date" timestamp,
	"crediting_period_years" integer,
	"technology" text,
	"capacity" numeric,
	"baseline" jsonb,
	"monitoring_plan" jsonb,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"registration_status" text DEFAULT 'INTERNAL' NOT NULL,
	"validation_status" text,
	"verification_status" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cqe_methodologies" (
	"id" text PRIMARY KEY NOT NULL,
	"methodology_code" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"sector" text DEFAULT 'Waste Handling & Disposal' NOT NULL,
	"version" text DEFAULT '1.0' NOT NULL,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"source_type" text DEFAULT 'CUSTOM' NOT NULL,
	"baseline_rules" text,
	"project_rules" text,
	"leakage_rules" text,
	"applicability" jsonb,
	"monitoring_requirements" jsonb,
	"parameters" jsonb,
	"emission_factors" jsonb,
	"tools_required" jsonb,
	"crediting_period_rules" text,
	"effective_date" text,
	"effective_from" timestamp,
	"effective_to" timestamp,
	"source_document" text,
	"source_reference" text,
	"evidence_reference" text,
	"issuer" text,
	"changelog" text,
	"baseline_equation_latex" text,
	"project_equation_latex" text,
	"leakage_equation_latex" text,
	"acva_accreditation_standard" text,
	"tenant_id" text,
	"created_by" text,
	"approved_by" text,
	"approved_at" timestamp,
	"superseded_by" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "electricity_meter_readings" (
	"id" text PRIMARY KEY NOT NULL,
	"instrument_id" text NOT NULL,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"generation_mwh" numeric,
	"export_mwh" numeric,
	"consumption_mwh" numeric,
	"evidence_id" text
);
--> statement-breakpoint
CREATE TABLE "evidence" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"measurement_id" text,
	"uploader_id" text NOT NULL,
	"file_url" text NOT NULL,
	"file_hash" text NOT NULL,
	"version" integer DEFAULT 1,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "facilities" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"location" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "farmers" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text,
	"aadhaar_hash" text,
	"village" text,
	"subdistrict" text,
	"district" text,
	"state" text,
	"land_area_acres" double precision DEFAULT 0,
	"primary_crop" text,
	"bank_account" text,
	"ifsc" text,
	"shg_id" text,
	"fpo_id" text,
	"created_by" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "findings" (
	"id" text PRIMARY KEY NOT NULL,
	"acva_case_id" text NOT NULL,
	"description" text NOT NULL,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "gas_meter_readings" (
	"id" text PRIMARY KEY NOT NULL,
	"instrument_id" text NOT NULL,
	"timestamp" timestamp NOT NULL,
	"flow" numeric NOT NULL,
	"unit" varchar(50) NOT NULL,
	"temperature" numeric,
	"pressure" numeric,
	"methane_fraction" numeric
);
--> statement-breakpoint
CREATE TABLE "generic_cpas" (
	"id" text PRIMARY KEY NOT NULL,
	"programme_id" text NOT NULL,
	"name" text NOT NULL,
	"activity_type" text,
	"technology_type" text,
	"methodology_id" text,
	"baseline_methodology" text,
	"additionality_methodology" text,
	"eligibility_criteria" jsonb DEFAULT '[]'::jsonb,
	"geographic_criteria" text,
	"monitoring_requirements" jsonb DEFAULT '[]'::jsonb,
	"evidence_requirements" jsonb DEFAULT '[]'::jsonb,
	"calculation_method" text,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hedera_anchors" (
	"id" text PRIMARY KEY NOT NULL,
	"record_id" text,
	"credential_id" text,
	"payload_hash" text NOT NULL,
	"network" text DEFAULT 'testnet' NOT NULL,
	"topic_id" text NOT NULL,
	"transaction_id" text,
	"consensus_timestamp" text,
	"status" text DEFAULT 'NOT_CONFIGURED' NOT NULL,
	"provider" text DEFAULT 'HEDERA_HCS' NOT NULL,
	"attempt_count" integer DEFAULT 0 NOT NULL,
	"last_attempt_at" timestamp,
	"confirmed_at" timestamp,
	"error_code" text,
	"error_message" text,
	"metadata" jsonb,
	"created_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "icm_accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"legal_entity_id" text,
	"entity_name" text NOT NULL,
	"account_registration_status" text DEFAULT 'PENDING' NOT NULL,
	"entity_type" text NOT NULL,
	"authorized_representative" text NOT NULL,
	"documents" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"external_reference" text,
	"account_id" text,
	"administrator_reference" text,
	"registration_date" timestamp,
	"approval_date" timestamp,
	"confirmed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "instrument_readiness" (
	"id" text PRIMARY KEY NOT NULL,
	"facility_id" text NOT NULL,
	"instrument_id" text NOT NULL,
	"installed_status" boolean DEFAULT false NOT NULL,
	"operational_status" boolean DEFAULT false NOT NULL,
	"calibrated_status" boolean DEFAULT false NOT NULL,
	"traceable_status" boolean DEFAULT false NOT NULL,
	"data_connected_status" boolean DEFAULT false NOT NULL,
	"readiness_rating" text DEFAULT 'BLOCKED' NOT NULL,
	"notes" text,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "instruments" (
	"id" text PRIMARY KEY NOT NULL,
	"facility_id" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'ACTIVE' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "landfill_facilities" (
	"id" text PRIMARY KEY NOT NULL,
	"facility_id" text NOT NULL,
	"landfill_type" varchar(255) NOT NULL,
	"start_date" timestamp NOT NULL,
	"closure_date" timestamp,
	"gas_capture_system" boolean DEFAULT false,
	"flare" boolean DEFAULT false,
	"energy_recovery" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "legal_entities" (
	"id" text PRIMARY KEY NOT NULL,
	"legal_name" text NOT NULL,
	"brand_name" text,
	"entity_type" text NOT NULL,
	"country" text,
	"registration_number" text,
	"tax_identifier" text,
	"registered_address" text,
	"contact_email" text,
	"contact_phone" text,
	"authorized_representative" text,
	"authorized_representative_designation" text,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"documents" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "measurements" (
	"id" text PRIMARY KEY NOT NULL,
	"monitoring_period_id" text NOT NULL,
	"instrument_id" text,
	"parameter_id" text NOT NULL,
	"value" double precision NOT NULL,
	"timestamp" timestamp NOT NULL,
	"recorded_by" text
);
--> statement-breakpoint
CREATE TABLE "methane_measurements" (
	"id" text PRIMARY KEY NOT NULL,
	"instrument_id" text NOT NULL,
	"timestamp" timestamp NOT NULL,
	"reading" numeric NOT NULL,
	"basis" varchar(255),
	"evidence_id" text
);
--> statement-breakpoint
CREATE TABLE "methodologies" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"active_version" text NOT NULL,
	CONSTRAINT "methodologies_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "methodology_parameters" (
	"id" text PRIMARY KEY NOT NULL,
	"methodology_version_id" text NOT NULL,
	"parameter_name" text NOT NULL,
	"data_type" text NOT NULL,
	"unit" text,
	"description" text,
	"is_required" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "methodology_versions" (
	"id" text PRIMARY KEY NOT NULL,
	"methodology_id" text NOT NULL,
	"version" text NOT NULL,
	"published_at" timestamp NOT NULL,
	"source_document" text,
	"source_hash" text
);
--> statement-breakpoint
CREATE TABLE "monitoring_datasets" (
	"id" text PRIMARY KEY NOT NULL,
	"monitoring_period_id" text NOT NULL,
	"parameter" text NOT NULL,
	"value" numeric NOT NULL,
	"unit" text NOT NULL,
	"measurement_method" text DEFAULT 'MEASURED' NOT NULL,
	"instrument_id" text,
	"measurement_timestamp" timestamp,
	"location" jsonb,
	"data_source" text,
	"operator" text,
	"quality_status" text,
	"evidence_id" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "monitoring_periods" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text,
	"cpa_id" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"data_completeness" numeric DEFAULT '0',
	"evidence_completeness" numeric DEFAULT '0',
	"calculation_status" text DEFAULT 'PENDING',
	"verification_status" text DEFAULT 'PENDING',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "monitoring_reports" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"monitoring_period_id" text NOT NULL,
	"methodology_id" text NOT NULL,
	"dataset_id" text NOT NULL,
	"calculation_run_id" text NOT NULL,
	"claimed_tco2e" numeric NOT NULL,
	"evidence_index" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"qa_qc_summary" text NOT NULL,
	"deviations" text,
	"corrective_actions" text,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"frozen_at" timestamp,
	"audit_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mrv_packages" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text,
	"cpa_id" text,
	"monitoring_period_id" text,
	"methodology_id" text,
	"baseline" jsonb,
	"additionality" jsonb,
	"monitoring_datasets" jsonb,
	"calculations" jsonb,
	"evidence" jsonb,
	"mass_balance" jsonb,
	"qa_qc" jsonb,
	"double_counting" jsonb,
	"carbon_rights" jsonb,
	"acva_status" text,
	"documents" jsonb,
	"hashes" jsonb,
	"version" integer DEFAULT 1,
	"audit_trail" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "operational_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"level" text DEFAULT 'INFO' NOT NULL,
	"category" text NOT NULL,
	"message" text NOT NULL,
	"user_id" text,
	"metadata" jsonb,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used" boolean DEFAULT false,
	"attempts" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pdd" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pdd_versions" (
	"id" text PRIMARY KEY NOT NULL,
	"pdd_id" text NOT NULL,
	"version" integer NOT NULL,
	"content" jsonb NOT NULL,
	"file_hash" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pilot_issues" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" varchar(255) NOT NULL,
	"issue_type" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"impact" varchar(100),
	"root_cause" text,
	"evidence_accepted" text,
	"resolution_time_hours" integer,
	"acva_satisfied" boolean DEFAULT false,
	"future_intake_guidance_update" text,
	"status" varchar(50) DEFAULT 'OPEN' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pilot_onboardings" (
	"id" text PRIMARY KEY NOT NULL,
	"pilot_name" text NOT NULL,
	"pilot_type" text NOT NULL,
	"location" jsonb,
	"operator_entity_id" text,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"onboarding_date" timestamp DEFAULT now(),
	"baseline_data" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pilot_records" (
	"id" text PRIMARY KEY NOT NULL,
	"pilot_id" text NOT NULL,
	"facility_id" text,
	"material_type" text NOT NULL,
	"weight_kg" double precision NOT NULL,
	"weighbridge_ticket" text,
	"gps_coordinates" jsonb,
	"status" text DEFAULT 'RECORDED' NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "project_intakes" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"project_owner" text NOT NULL,
	"legal_entity" text NOT NULL,
	"icm_account_status" text NOT NULL,
	"facility_owner" text NOT NULL,
	"facility_operator" text NOT NULL,
	"site_location" text NOT NULL,
	"landfill_info" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"waste_history" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"gas_capture_infra" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"flare_utilisation_infra" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"instruments_list" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"calibration_records_list" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"monitoring_system" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"land_ownership_rights" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"carbon_benefit_ownership" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"applicable_permits" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"contracts" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"existing_environmental_records" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"intake_status" text DEFAULT 'INCOMPLETE' NOT NULL,
	"eligibility_assessment" text DEFAULT 'INSUFFICIENT_DATA' NOT NULL,
	"eligibility_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "records" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"waste_type" text NOT NULL,
	"weight_kg" double precision NOT NULL,
	"village" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"mrv_status" text DEFAULT 'pending' NOT NULL,
	"mrv_verified_by" text,
	"total_value" double precision DEFAULT 0,
	"ccc_amount_kg" double precision DEFAULT 0,
	"potential_ccc_value" double precision DEFAULT 0,
	"risk_score" double precision,
	"evidence_urls" jsonb,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "system_notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"type" text DEFAULT 'INFO' NOT NULL,
	"read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "urban_collection_operators" (
	"id" text PRIMARY KEY NOT NULL,
	"legal_entity_id" text,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "urban_generators" (
	"id" text PRIMARY KEY NOT NULL,
	"ward_id" text,
	"type" text NOT NULL,
	"name" text,
	"rfid_or_qr" text
);
--> statement-breakpoint
CREATE TABLE "urban_transport_operators" (
	"id" text PRIMARY KEY NOT NULL,
	"legal_entity_id" text,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "urban_ulbs" (
	"id" text PRIMARY KEY NOT NULL,
	"legal_entity_id" text,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"district" text NOT NULL,
	"state" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "urban_vehicles" (
	"id" text PRIMARY KEY NOT NULL,
	"transport_operator_id" text,
	"registration_number" text NOT NULL,
	"type" text,
	"gps_enabled" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "urban_wards" (
	"id" text PRIMARY KEY NOT NULL,
	"zone_id" text NOT NULL,
	"ward_number" text NOT NULL,
	"name" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "urban_zones" (
	"id" text PRIMARY KEY NOT NULL,
	"ulb_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text,
	"role" text,
	"name" text NOT NULL,
	"phone" text,
	"state" text,
	"district" text,
	"subdistrict" text,
	"local_area" text,
	"village" text,
	"organization_name" text,
	"wallet_balance" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "waste_deposition_history" (
	"id" text PRIMARY KEY NOT NULL,
	"landfill_facility_id" text NOT NULL,
	"year" integer NOT NULL,
	"waste_type" varchar(255) NOT NULL,
	"quantity" numeric NOT NULL,
	"doc" numeric,
	"docf" numeric,
	"mcf" numeric,
	"k" numeric,
	"source" varchar(255),
	"evidence_id" text
);
--> statement-breakpoint
CREATE TABLE "waste_manifests" (
	"id" text PRIMARY KEY NOT NULL,
	"generator_id" text,
	"collection_operator_id" text,
	"transport_operator_id" text,
	"vehicle_id" text,
	"weighbridge_record_id" text,
	"destination_facility_id" text,
	"material_type" text NOT NULL,
	"weight_kg" numeric,
	"collected_at" timestamp,
	"delivered_at" timestamp,
	"status" text DEFAULT 'IN_TRANSIT' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weighbridge_records" (
	"id" text PRIMARY KEY NOT NULL,
	"facility_id" text NOT NULL,
	"ticket_number" varchar(255) NOT NULL,
	"vehicle_id" varchar(255),
	"gross_weight" numeric NOT NULL,
	"tare_weight" numeric NOT NULL,
	"net_weight" numeric NOT NULL,
	"material" varchar(255) NOT NULL,
	"timestamp" timestamp NOT NULL,
	"source_record_id" text,
	"evidence_hash" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "acva_appointments" ADD CONSTRAINT "acva_appointments_project_id_carbon_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."carbon_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "acva_appointments" ADD CONSTRAINT "acva_appointments_acva_registry_id_acva_registry_id_fk" FOREIGN KEY ("acva_registry_id") REFERENCES "public"."acva_registry"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "acva_cases" ADD CONSTRAINT "acva_cases_project_id_carbon_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."carbon_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "acva_cases" ADD CONSTRAINT "acva_cases_auditor_id_users_uid_fk" FOREIGN KEY ("auditor_id") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "acva_engagements" ADD CONSTRAINT "acva_engagements_project_id_carbon_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."carbon_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "acva_engagements" ADD CONSTRAINT "acva_engagements_cpa_id_component_project_activities_id_fk" FOREIGN KEY ("cpa_id") REFERENCES "public"."component_project_activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_packages" ADD CONSTRAINT "audit_packages_project_id_carbon_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."carbon_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calculation_datasets" ADD CONSTRAINT "calculation_datasets_project_id_carbon_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."carbon_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calculation_datasets" ADD CONSTRAINT "calculation_datasets_monitoring_period_id_monitoring_periods_id_fk" FOREIGN KEY ("monitoring_period_id") REFERENCES "public"."monitoring_periods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calculation_runs" ADD CONSTRAINT "calculation_runs_dataset_id_calculation_datasets_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."calculation_datasets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calculation_runs" ADD CONSTRAINT "calculation_runs_methodology_version_id_methodology_versions_id_fk" FOREIGN KEY ("methodology_version_id") REFERENCES "public"."methodology_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calibrations" ADD CONSTRAINT "calibrations_instrument_id_instruments_id_fk" FOREIGN KEY ("instrument_id") REFERENCES "public"."instruments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carbon_claims" ADD CONSTRAINT "carbon_claims_calculation_run_id_calculation_runs_id_fk" FOREIGN KEY ("calculation_run_id") REFERENCES "public"."calculation_runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carbon_events" ADD CONSTRAINT "carbon_events_record_id_records_id_fk" FOREIGN KEY ("record_id") REFERENCES "public"."records"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carbon_programmes" ADD CONSTRAINT "carbon_programmes_icm_account_id_icm_accounts_id_fk" FOREIGN KEY ("icm_account_id") REFERENCES "public"."icm_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carbon_projects" ADD CONSTRAINT "carbon_projects_owner_id_users_uid_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carbon_projects" ADD CONSTRAINT "carbon_projects_waste_source_record_id_records_id_fk" FOREIGN KEY ("waste_source_record_id") REFERENCES "public"."records"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carbon_projects" ADD CONSTRAINT "carbon_projects_icm_account_id_icm_accounts_id_fk" FOREIGN KEY ("icm_account_id") REFERENCES "public"."icm_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carbon_projects" ADD CONSTRAINT "carbon_projects_programme_id_carbon_programmes_id_fk" FOREIGN KEY ("programme_id") REFERENCES "public"."carbon_programmes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carbon_projects" ADD CONSTRAINT "carbon_projects_generic_cpa_id_generic_cpas_id_fk" FOREIGN KEY ("generic_cpa_id") REFERENCES "public"."generic_cpas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carbon_projects" ADD CONSTRAINT "carbon_projects_cpa_id_component_project_activities_id_fk" FOREIGN KEY ("cpa_id") REFERENCES "public"."component_project_activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carbon_projects" ADD CONSTRAINT "carbon_projects_legal_entity_id_legal_entities_id_fk" FOREIGN KEY ("legal_entity_id") REFERENCES "public"."legal_entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carbon_rights" ADD CONSTRAINT "carbon_rights_project_id_carbon_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."carbon_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carbon_rights" ADD CONSTRAINT "carbon_rights_cpa_id_component_project_activities_id_fk" FOREIGN KEY ("cpa_id") REFERENCES "public"."component_project_activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carbon_rights" ADD CONSTRAINT "carbon_rights_rights_holder_entity_id_legal_entities_id_fk" FOREIGN KEY ("rights_holder_entity_id") REFERENCES "public"."legal_entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carbon_rights" ADD CONSTRAINT "carbon_rights_asset_owner_entity_id_legal_entities_id_fk" FOREIGN KEY ("asset_owner_entity_id") REFERENCES "public"."legal_entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carbon_rights" ADD CONSTRAINT "carbon_rights_operator_entity_id_legal_entities_id_fk" FOREIGN KEY ("operator_entity_id") REFERENCES "public"."legal_entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carbon_rights" ADD CONSTRAINT "carbon_rights_beneficiary_entity_id_legal_entities_id_fk" FOREIGN KEY ("beneficiary_entity_id") REFERENCES "public"."legal_entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ccts_submissions" ADD CONSTRAINT "ccts_submissions_project_id_carbon_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."carbon_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_carbon_claim_id_carbon_claims_id_fk" FOREIGN KEY ("carbon_claim_id") REFERENCES "public"."carbon_claims"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "component_project_activities" ADD CONSTRAINT "component_project_activities_generic_cpa_id_generic_cpas_id_fk" FOREIGN KEY ("generic_cpa_id") REFERENCES "public"."generic_cpas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "component_project_activities" ADD CONSTRAINT "component_project_activities_operator_entity_id_legal_entities_id_fk" FOREIGN KEY ("operator_entity_id") REFERENCES "public"."legal_entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "electricity_meter_readings" ADD CONSTRAINT "electricity_meter_readings_instrument_id_instruments_id_fk" FOREIGN KEY ("instrument_id") REFERENCES "public"."instruments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "electricity_meter_readings" ADD CONSTRAINT "electricity_meter_readings_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_project_id_carbon_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."carbon_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_measurement_id_measurements_id_fk" FOREIGN KEY ("measurement_id") REFERENCES "public"."measurements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_uploader_id_users_uid_fk" FOREIGN KEY ("uploader_id") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facilities" ADD CONSTRAINT "facilities_project_id_carbon_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."carbon_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "findings" ADD CONSTRAINT "findings_acva_case_id_acva_cases_id_fk" FOREIGN KEY ("acva_case_id") REFERENCES "public"."acva_cases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gas_meter_readings" ADD CONSTRAINT "gas_meter_readings_instrument_id_instruments_id_fk" FOREIGN KEY ("instrument_id") REFERENCES "public"."instruments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generic_cpas" ADD CONSTRAINT "generic_cpas_programme_id_carbon_programmes_id_fk" FOREIGN KEY ("programme_id") REFERENCES "public"."carbon_programmes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "icm_accounts" ADD CONSTRAINT "icm_accounts_legal_entity_id_legal_entities_id_fk" FOREIGN KEY ("legal_entity_id") REFERENCES "public"."legal_entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instrument_readiness" ADD CONSTRAINT "instrument_readiness_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instrument_readiness" ADD CONSTRAINT "instrument_readiness_instrument_id_instruments_id_fk" FOREIGN KEY ("instrument_id") REFERENCES "public"."instruments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instruments" ADD CONSTRAINT "instruments_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "landfill_facilities" ADD CONSTRAINT "landfill_facilities_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_monitoring_period_id_monitoring_periods_id_fk" FOREIGN KEY ("monitoring_period_id") REFERENCES "public"."monitoring_periods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_instrument_id_instruments_id_fk" FOREIGN KEY ("instrument_id") REFERENCES "public"."instruments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_parameter_id_methodology_parameters_id_fk" FOREIGN KEY ("parameter_id") REFERENCES "public"."methodology_parameters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_recorded_by_users_uid_fk" FOREIGN KEY ("recorded_by") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "methane_measurements" ADD CONSTRAINT "methane_measurements_instrument_id_instruments_id_fk" FOREIGN KEY ("instrument_id") REFERENCES "public"."instruments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "methane_measurements" ADD CONSTRAINT "methane_measurements_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "methodology_parameters" ADD CONSTRAINT "methodology_parameters_methodology_version_id_methodology_versions_id_fk" FOREIGN KEY ("methodology_version_id") REFERENCES "public"."methodology_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "methodology_versions" ADD CONSTRAINT "methodology_versions_methodology_id_methodologies_id_fk" FOREIGN KEY ("methodology_id") REFERENCES "public"."methodologies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitoring_datasets" ADD CONSTRAINT "monitoring_datasets_monitoring_period_id_monitoring_periods_id_fk" FOREIGN KEY ("monitoring_period_id") REFERENCES "public"."monitoring_periods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitoring_periods" ADD CONSTRAINT "monitoring_periods_project_id_carbon_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."carbon_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitoring_periods" ADD CONSTRAINT "monitoring_periods_cpa_id_component_project_activities_id_fk" FOREIGN KEY ("cpa_id") REFERENCES "public"."component_project_activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitoring_reports" ADD CONSTRAINT "monitoring_reports_project_id_carbon_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."carbon_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mrv_packages" ADD CONSTRAINT "mrv_packages_project_id_carbon_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."carbon_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mrv_packages" ADD CONSTRAINT "mrv_packages_cpa_id_component_project_activities_id_fk" FOREIGN KEY ("cpa_id") REFERENCES "public"."component_project_activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mrv_packages" ADD CONSTRAINT "mrv_packages_monitoring_period_id_monitoring_periods_id_fk" FOREIGN KEY ("monitoring_period_id") REFERENCES "public"."monitoring_periods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pdd" ADD CONSTRAINT "pdd_project_id_carbon_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."carbon_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pdd_versions" ADD CONSTRAINT "pdd_versions_pdd_id_pdd_id_fk" FOREIGN KEY ("pdd_id") REFERENCES "public"."pdd"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pilot_onboardings" ADD CONSTRAINT "pilot_onboardings_operator_entity_id_legal_entities_id_fk" FOREIGN KEY ("operator_entity_id") REFERENCES "public"."legal_entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pilot_records" ADD CONSTRAINT "pilot_records_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_intakes" ADD CONSTRAINT "project_intakes_project_id_carbon_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."carbon_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "records" ADD CONSTRAINT "records_user_id_users_uid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "urban_collection_operators" ADD CONSTRAINT "urban_collection_operators_legal_entity_id_legal_entities_id_fk" FOREIGN KEY ("legal_entity_id") REFERENCES "public"."legal_entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "urban_generators" ADD CONSTRAINT "urban_generators_ward_id_urban_wards_id_fk" FOREIGN KEY ("ward_id") REFERENCES "public"."urban_wards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "urban_transport_operators" ADD CONSTRAINT "urban_transport_operators_legal_entity_id_legal_entities_id_fk" FOREIGN KEY ("legal_entity_id") REFERENCES "public"."legal_entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "urban_ulbs" ADD CONSTRAINT "urban_ulbs_legal_entity_id_legal_entities_id_fk" FOREIGN KEY ("legal_entity_id") REFERENCES "public"."legal_entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "urban_vehicles" ADD CONSTRAINT "urban_vehicles_transport_operator_id_urban_transport_operators_id_fk" FOREIGN KEY ("transport_operator_id") REFERENCES "public"."urban_transport_operators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "urban_wards" ADD CONSTRAINT "urban_wards_zone_id_urban_zones_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."urban_zones"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "urban_zones" ADD CONSTRAINT "urban_zones_ulb_id_urban_ulbs_id_fk" FOREIGN KEY ("ulb_id") REFERENCES "public"."urban_ulbs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waste_deposition_history" ADD CONSTRAINT "waste_deposition_history_landfill_facility_id_landfill_facilities_id_fk" FOREIGN KEY ("landfill_facility_id") REFERENCES "public"."landfill_facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waste_deposition_history" ADD CONSTRAINT "waste_deposition_history_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waste_manifests" ADD CONSTRAINT "waste_manifests_generator_id_urban_generators_id_fk" FOREIGN KEY ("generator_id") REFERENCES "public"."urban_generators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waste_manifests" ADD CONSTRAINT "waste_manifests_collection_operator_id_urban_collection_operators_id_fk" FOREIGN KEY ("collection_operator_id") REFERENCES "public"."urban_collection_operators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waste_manifests" ADD CONSTRAINT "waste_manifests_transport_operator_id_urban_transport_operators_id_fk" FOREIGN KEY ("transport_operator_id") REFERENCES "public"."urban_transport_operators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waste_manifests" ADD CONSTRAINT "waste_manifests_vehicle_id_urban_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."urban_vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waste_manifests" ADD CONSTRAINT "waste_manifests_weighbridge_record_id_weighbridge_records_id_fk" FOREIGN KEY ("weighbridge_record_id") REFERENCES "public"."weighbridge_records"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waste_manifests" ADD CONSTRAINT "waste_manifests_destination_facility_id_facilities_id_fk" FOREIGN KEY ("destination_facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weighbridge_records" ADD CONSTRAINT "weighbridge_records_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weighbridge_records" ADD CONSTRAINT "weighbridge_records_source_record_id_records_id_fk" FOREIGN KEY ("source_record_id") REFERENCES "public"."records"("id") ON DELETE no action ON UPDATE no action;