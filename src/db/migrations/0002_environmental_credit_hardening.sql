-- Environmental Credit Depository hardening.
-- Existing 0001 is retained for migration history; this migration normalises
-- monetary/credit quantities to exact NUMERIC arithmetic and makes the event
-- ledger append-only at the database boundary.

ALTER TABLE environmental_credit_positions
  ALTER COLUMN issued_quantity TYPE numeric(24,6) USING issued_quantity::numeric(24,6),
  ALTER COLUMN available_quantity TYPE numeric(24,6) USING available_quantity::numeric(24,6),
  ALTER COLUMN reserved_quantity TYPE numeric(24,6) USING reserved_quantity::numeric(24,6),
  ALTER COLUMN transferred_quantity TYPE numeric(24,6) USING transferred_quantity::numeric(24,6),
  ALTER COLUMN retired_quantity TYPE numeric(24,6) USING retired_quantity::numeric(24,6);

ALTER TABLE environmental_credit_transactions
  ALTER COLUMN quantity TYPE numeric(24,6) USING quantity::numeric(24,6);

CREATE OR REPLACE FUNCTION prevent_environmental_credit_transaction_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Environmental credit transaction ledger is append-only';
END;
$$;

DROP TRIGGER IF EXISTS environmental_credit_transactions_immutable
  ON environmental_credit_transactions;

CREATE TRIGGER environmental_credit_transactions_immutable
BEFORE UPDATE OR DELETE ON environmental_credit_transactions
FOR EACH ROW EXECUTE FUNCTION prevent_environmental_credit_transaction_mutation();

CREATE INDEX IF NOT EXISTS environmental_credit_transactions_idempotency_idx
  ON environmental_credit_transactions(idempotency_key);
