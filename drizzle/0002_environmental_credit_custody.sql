CREATE TABLE "environmental_credit_positions" (
  "id" text PRIMARY KEY NOT NULL,
  "credit_type" text NOT NULL,
  "authoritative_registry" text NOT NULL,
  "registry_account_id" text NOT NULL,
  "authoritative_credit_reference" text NOT NULL,
  "holder_entity_id" text NOT NULL,
  "issued_quantity" double precision NOT NULL,
  "available_quantity" double precision NOT NULL DEFAULT 0,
  "reserved_quantity" double precision NOT NULL DEFAULT 0,
  "transferred_quantity" double precision NOT NULL DEFAULT 0,
  "retired_quantity" double precision NOT NULL DEFAULT 0,
  "authoritative_verified_at" timestamp NOT NULL,
  "tradability_status" text NOT NULL,
  "status" text NOT NULL DEFAULT 'HELD',
  "metadata" jsonb,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  CONSTRAINT "environmental_credit_positions_nonnegative" CHECK (
    issued_quantity >= 0 AND
    available_quantity >= 0 AND
    reserved_quantity >= 0 AND
    transferred_quantity >= 0 AND
    retired_quantity >= 0
  ),
  CONSTRAINT "environmental_credit_positions_conserved" CHECK (
    available_quantity + reserved_quantity + transferred_quantity + retired_quantity = issued_quantity
  )
);
--> statement-breakpoint
CREATE INDEX "environmental_credit_positions_holder_idx" ON "environmental_credit_positions" ("holder_entity_id");
--> statement-breakpoint
CREATE INDEX "environmental_credit_positions_reference_idx" ON "environmental_credit_positions" ("authoritative_credit_reference");
--> statement-breakpoint
CREATE TABLE "environmental_credit_transactions" (
  "id" text PRIMARY KEY NOT NULL,
  "position_id" text NOT NULL,
  "transaction_type" text NOT NULL,
  "quantity" double precision NOT NULL,
  "buyer_entity_id" text,
  "authoritative_transaction_reference" text,
  "idempotency_key" text NOT NULL,
  "actor_uid" text NOT NULL,
  "metadata" jsonb,
  "created_at" timestamp DEFAULT now(),
  CONSTRAINT "environmental_credit_transactions_quantity_positive" CHECK (quantity > 0),
  CONSTRAINT "environmental_credit_transactions_idempotency_unique" UNIQUE ("idempotency_key")
);
--> statement-breakpoint
CREATE INDEX "environmental_credit_transactions_position_idx" ON "environmental_credit_transactions" ("position_id");
