CREATE TABLE IF NOT EXISTS "gcp_commercial_lifecycle_events" (
  "id" text PRIMARY KEY NOT NULL,
  "position_id" text NOT NULL,
  "sequence_no" integer NOT NULL,
  "from_state" text,
  "state" text NOT NULL,
  "event_type" text NOT NULL,
  "actor_uid" text,
  "idempotency_key" text,
  "authoritative_reference" text,
  "quantity" numeric,
  "metadata" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "previous_hash" text NOT NULL,
  "event_hash" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "gcp_lifecycle_position_sequence_unique" UNIQUE ("position_id", "sequence_no"),
  CONSTRAINT "gcp_lifecycle_idempotency_unique" UNIQUE ("idempotency_key")
);

CREATE INDEX IF NOT EXISTS "gcp_lifecycle_position_idx" ON "gcp_commercial_lifecycle_events" ("position_id", "sequence_no");
