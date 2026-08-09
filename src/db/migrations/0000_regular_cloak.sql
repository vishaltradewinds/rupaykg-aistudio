CREATE TABLE "acva_cases" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"auditor_id" text,
	"created_at" timestamp DEFAULT now()
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
CREATE TABLE "carbon_projects" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"owner_id" text NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"methodology_id" text,
	"waste_source_record_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "certificates" (
	"id" text PRIMARY KEY NOT NULL,
	"carbon_claim_id" text NOT NULL,
	"serial_number" text NOT NULL,
	"status" text DEFAULT 'ISSUED' NOT NULL,
	"issue_date" timestamp DEFAULT now(),
	CONSTRAINT "certificates_serial_number_unique" UNIQUE("serial_number")
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
CREATE TABLE "findings" (
	"id" text PRIMARY KEY NOT NULL,
	"acva_case_id" text NOT NULL,
	"description" text NOT NULL,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"created_at" timestamp DEFAULT now()
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
CREATE TABLE "monitoring_periods" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"status" text DEFAULT 'ACTIVE' NOT NULL
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
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" text NOT NULL,
	"email" text NOT NULL,
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
ALTER TABLE "acva_cases" ADD CONSTRAINT "acva_cases_project_id_carbon_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."carbon_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "acva_cases" ADD CONSTRAINT "acva_cases_auditor_id_users_uid_fk" FOREIGN KEY ("auditor_id") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calculation_datasets" ADD CONSTRAINT "calculation_datasets_project_id_carbon_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."carbon_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calculation_datasets" ADD CONSTRAINT "calculation_datasets_monitoring_period_id_monitoring_periods_id_fk" FOREIGN KEY ("monitoring_period_id") REFERENCES "public"."monitoring_periods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calculation_runs" ADD CONSTRAINT "calculation_runs_dataset_id_calculation_datasets_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."calculation_datasets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calculation_runs" ADD CONSTRAINT "calculation_runs_methodology_version_id_methodology_versions_id_fk" FOREIGN KEY ("methodology_version_id") REFERENCES "public"."methodology_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calibrations" ADD CONSTRAINT "calibrations_instrument_id_instruments_id_fk" FOREIGN KEY ("instrument_id") REFERENCES "public"."instruments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carbon_claims" ADD CONSTRAINT "carbon_claims_calculation_run_id_calculation_runs_id_fk" FOREIGN KEY ("calculation_run_id") REFERENCES "public"."calculation_runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carbon_projects" ADD CONSTRAINT "carbon_projects_owner_id_users_uid_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carbon_projects" ADD CONSTRAINT "carbon_projects_waste_source_record_id_records_id_fk" FOREIGN KEY ("waste_source_record_id") REFERENCES "public"."records"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_carbon_claim_id_carbon_claims_id_fk" FOREIGN KEY ("carbon_claim_id") REFERENCES "public"."carbon_claims"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_project_id_carbon_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."carbon_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_measurement_id_measurements_id_fk" FOREIGN KEY ("measurement_id") REFERENCES "public"."measurements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_uploader_id_users_uid_fk" FOREIGN KEY ("uploader_id") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facilities" ADD CONSTRAINT "facilities_project_id_carbon_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."carbon_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "findings" ADD CONSTRAINT "findings_acva_case_id_acva_cases_id_fk" FOREIGN KEY ("acva_case_id") REFERENCES "public"."acva_cases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instruments" ADD CONSTRAINT "instruments_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_monitoring_period_id_monitoring_periods_id_fk" FOREIGN KEY ("monitoring_period_id") REFERENCES "public"."monitoring_periods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_instrument_id_instruments_id_fk" FOREIGN KEY ("instrument_id") REFERENCES "public"."instruments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_parameter_id_methodology_parameters_id_fk" FOREIGN KEY ("parameter_id") REFERENCES "public"."methodology_parameters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_recorded_by_users_uid_fk" FOREIGN KEY ("recorded_by") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "methodology_parameters" ADD CONSTRAINT "methodology_parameters_methodology_version_id_methodology_versions_id_fk" FOREIGN KEY ("methodology_version_id") REFERENCES "public"."methodology_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "methodology_versions" ADD CONSTRAINT "methodology_versions_methodology_id_methodologies_id_fk" FOREIGN KEY ("methodology_id") REFERENCES "public"."methodologies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitoring_periods" ADD CONSTRAINT "monitoring_periods_project_id_carbon_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."carbon_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pdd" ADD CONSTRAINT "pdd_project_id_carbon_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."carbon_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pdd_versions" ADD CONSTRAINT "pdd_versions_pdd_id_pdd_id_fk" FOREIGN KEY ("pdd_id") REFERENCES "public"."pdd"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "records" ADD CONSTRAINT "records_user_id_users_uid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;