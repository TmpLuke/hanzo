-- Fix duplicate orders by adding unique constraint on payment_id
-- This ensures one webhook event = one order

-- First, identify and keep only the first order for each payment_id
-- Delete duplicates (keeping the earliest created_at)
WITH duplicates AS (
  SELECT 
    id,
    payment_id,
    ROW_NUMBER() OVER (PARTITION BY payment_id ORDER BY created_at ASC) as rn
  FROM orders
  WHERE payment_id IS NOT NULL
)
DELETE FROM orders
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- Add unique constraint to prevent future duplicates
ALTER TABLE orders 
ADD CONSTRAINT orders_payment_id_unique UNIQUE (payment_id);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON orders(payment_id);
