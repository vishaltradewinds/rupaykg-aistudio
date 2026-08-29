CREATE TABLE IF NOT EXISTS environmental_credit_positions (
  id text PRIMARY KEY,
  credit_type text NOT NULL CHECK (credit_type IN ('CCC','GREEN_CREDIT')),
  authoritative_registry text NOT NULL CHECK (authoritative_registry IN ('BEE_ICM','GCP_ICFRE')),
  registry_account_id text NOT NULL,
  authoritative_credit_reference text NOT NULL,
  holder_entity_id text NOT NULL,
  issued_quantity double precision NOT NULL CHECK (issued_quantity > 0),
  available_quantity double precision NOT NULL CHECK (available_quantity >= 0),
  reserved_quantity double precision NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
  transferred_quantity double precision NOT NULL DEFAULT 0 CHECK (transferred_quantity >= 0),
  retired_quantity double precision NOT NULL DEFAULT 0 CHECK (retired_quantity >= 0),
  status text NOT NULL DEFAULT 'HELD' CHECK (status IN ('HELD','RESERVED','TRANSFER_PENDING','TRANSFERRED','RETIRED','BLOCKED')),
  tradability_status text NOT NULL DEFAULT 'UNKNOWN' CHECK (tradability_status IN ('UNKNOWN','TRADABLE','NON_TRADABLE')),
  authoritative_verified_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT environmental_credit_quantity_conservation CHECK (issued_quantity = available_quantity + reserved_quantity + transferred_quantity + retired_quantity),
  CONSTRAINT environmental_credit_registry_reference_unique UNIQUE (authoritative_registry, authoritative_credit_reference)
);

CREATE TABLE IF NOT EXISTS environmental_credit_transactions (
  id text PRIMARY KEY,
  position_id text NOT NULL REFERENCES environmental_credit_positions(id),
  transaction_type text NOT NULL CHECK (transaction_type IN ('CUSTODY','RESERVE','RELEASE','TRANSFER','RETIRE','BLOCK','RECONCILE')),
  quantity double precision NOT NULL CHECK (quantity > 0),
  buyer_entity_id text,
  authoritative_transaction_reference text,
  idempotency_key text NOT NULL UNIQUE,
  actor_uid text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS environmental_credit_positions_holder_idx ON environmental_credit_positions(holder_entity_id);
CREATE INDEX IF NOT EXISTS environmental_credit_positions_market_idx ON environmental_credit_positions(credit_type, status, tradability_status);
CREATE INDEX IF NOT EXISTS environmental_credit_transactions_position_idx ON environmental_credit_transactions(position_id, created_at);
