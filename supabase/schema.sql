-- Create extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT NOT NULL UNIQUE,
  phone_number TEXT,
  country_code TEXT,
  update_modes TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Add constraints
  CONSTRAINT wallet_address_not_empty CHECK (wallet_address <> '')
);

-- Create nonces table for SIWE authentication
CREATE TABLE IF NOT EXISTS nonces (
  nonce TEXT PRIMARY KEY,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add an RLS policy to automatically delete expired nonces
CREATE OR REPLACE FUNCTION delete_expired_nonces()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM nonces WHERE expires_at < NOW();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_delete_expired_nonces
AFTER INSERT ON nonces
EXECUTE FUNCTION delete_expired_nonces();

-- Create index for faster lookups by wallet address
CREATE INDEX IF NOT EXISTS idx_waitlist_wallet_address ON waitlist_entries(wallet_address);

-- Create function to check if wallet exists and get registration status
CREATE OR REPLACE FUNCTION check_wallet_registration(wallet TEXT)
RETURNS TABLE (
  exists BOOLEAN,
  has_completed_registration BOOLEAN,
  entry_id UUID
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) > 0 AS exists,
    (COUNT(*) > 0 AND phone_number IS NOT NULL) AS has_completed_registration,
    id AS entry_id
  FROM 
    waitlist_entries
  WHERE 
    wallet_address = wallet;
END;
$$ LANGUAGE plpgsql; 