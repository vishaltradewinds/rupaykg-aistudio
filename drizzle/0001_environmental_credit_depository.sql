CREATE TABLE IF NOT EXISTS "credit_custody" (
	"id" text PRIMARY KEY NOT NULL,
	"credit_type" text NOT NULL,
	"authoritative_registry" text NOT NULL,
	"registry_account_id" text NOT NULL,
	"authoritative_credit_reference" text NOT NULL,
	"holder_entity_id" text,
	"holder_user_id" text,
	"issued_quantity" double precision NOT NULL,
	"available_quantity" double precision DEFAULT 0 NOT NULL,
	"reserved_quantity" double precision DEFAULT 0 NOT NULL,
	"transferred_quantity" double precision DEFAULT 0 NOT NULL,
	"retired_quantity" double precision DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'HELD' NOT NULL,
	"tradability_status" text DEFAULT 'TRADABLE' NOT NULL,
	"methodology_code" text,
	"vintage" text,
	"issuance_date" timestamp,
	"authoritative_verification_timestamp" timestamp,
	"acva_verifier_id" text,
	"origin_project_id" text,
	"origin_facility_id" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "credit_custody_authoritative_credit_reference_unique" UNIQUE("authoritative_credit_reference")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "credit_custody_events" (
	"id" text PRIMARY KEY NOT NULL,
	"custody_id" text NOT NULL,
	"event_type" text NOT NULL,
	"quantity" double precision NOT NULL,
	"previous_available" double precision NOT NULL,
	"new_available" double precision NOT NULL,
	"previous_reserved" double precision NOT NULL,
	"new_reserved" double precision NOT NULL,
	"previous_transferred" double precision NOT NULL,
	"new_transferred" double precision NOT NULL,
	"previous_retired" double precision NOT NULL,
	"new_retired" double precision NOT NULL,
	"from_entity_id" text,
	"to_entity_id" text,
	"order_id" text,
	"idempotency_key" text,
	"performed_by" text NOT NULL,
	"authoritative_registry_ref" text,
	"hedera_anchor_id" text,
	"notes" text,
	"metadata" jsonb,
	"timestamp" timestamp DEFAULT now(),
	CONSTRAINT "credit_custody_events_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "credit_market_listings" (
	"id" text PRIMARY KEY NOT NULL,
	"custody_id" text NOT NULL,
	"seller_entity_id" text NOT NULL,
	"seller_user_id" text NOT NULL,
	"credit_type" text NOT NULL,
	"listed_quantity" double precision NOT NULL,
	"available_quantity" double precision NOT NULL,
	"price_per_unit_inr" double precision NOT NULL,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"waterfall_breakdown" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "credit_reservations" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"custody_id" text NOT NULL,
	"buyer_entity_id" text NOT NULL,
	"buyer_user_id" text NOT NULL,
	"reserved_quantity" double precision NOT NULL,
	"price_per_unit_inr" double precision NOT NULL,
	"total_amount_inr" double precision NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"idempotency_key" text,
	"waterfall_manifest" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "credit_reservations_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "credit_settlements" (
	"id" text PRIMARY KEY NOT NULL,
	"reservation_id" text NOT NULL,
	"custody_id" text NOT NULL,
	"listing_id" text NOT NULL,
	"buyer_entity_id" text NOT NULL,
	"seller_entity_id" text NOT NULL,
	"transferred_quantity" double precision NOT NULL,
	"total_settlement_inr" double precision NOT NULL,
	"waterfall_settlement" jsonb NOT NULL,
	"authoritative_transfer_ref" text,
	"hedera_evidence_anchor_id" text,
	"status" text DEFAULT 'COMPLETED' NOT NULL,
	"settled_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_custody" ADD CONSTRAINT "credit_custody_holder_entity_id_legal_entities_id_fk" FOREIGN KEY ("holder_entity_id") REFERENCES "public"."legal_entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_custody" ADD CONSTRAINT "credit_custody_origin_project_id_carbon_projects_id_fk" FOREIGN KEY ("origin_project_id") REFERENCES "public"."carbon_projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_custody" ADD CONSTRAINT "credit_custody_origin_facility_id_facilities_id_fk" FOREIGN KEY ("origin_facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_custody_events" ADD CONSTRAINT "credit_custody_events_custody_id_credit_custody_id_fk" FOREIGN KEY ("custody_id") REFERENCES "public"."credit_custody"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_market_listings" ADD CONSTRAINT "credit_market_listings_custody_id_credit_custody_id_fk" FOREIGN KEY ("custody_id") REFERENCES "public"."credit_custody"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_reservations" ADD CONSTRAINT "credit_reservations_listing_id_credit_market_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."credit_market_listings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_reservations" ADD CONSTRAINT "credit_reservations_custody_id_credit_custody_id_fk" FOREIGN KEY ("custody_id") REFERENCES "public"."credit_custody"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_settlements" ADD CONSTRAINT "credit_settlements_reservation_id_credit_reservations_id_fk" FOREIGN KEY ("reservation_id") REFERENCES "public"."credit_reservations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_settlements" ADD CONSTRAINT "credit_settlements_custody_id_credit_custody_id_fk" FOREIGN KEY ("custody_id") REFERENCES "public"."credit_custody"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_settlements" ADD CONSTRAINT "credit_settlements_listing_id_credit_market_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."credit_market_listings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
