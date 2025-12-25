-- Add rating and reviews columns to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 4.5;
ALTER TABLE products ADD COLUMN IF NOT EXISTS reviews INTEGER DEFAULT 50;

-- Update products with varied ratings and reviews to look more natural
UPDATE products SET rating = 4.9, reviews = 342 WHERE name = 'PUBG Cheat';
UPDATE products SET rating = 4.6, reviews = 187 WHERE name = 'BO7 Cheat';
UPDATE products SET rating = 4.7, reviews = 256 WHERE name = 'Rust Cheat';
UPDATE products SET rating = 4.8, reviews = 421 WHERE name = 'Fortnite Cheat';
UPDATE products SET rating = 4.5, reviews = 163 WHERE name = 'Apex Legends Cheat';
UPDATE products SET rating = 4.7, reviews = 298 WHERE name = 'Valorant Cheat';
UPDATE products SET rating = 4.9, reviews = 512 WHERE name = 'HWID Spoofer';
UPDATE products SET rating = 4.4, reviews = 89 WHERE name = 'Battlefield 6 Cheat';
UPDATE products SET rating = 4.6, reviews = 234 WHERE name = 'Rainbow Six Siege Cheat';
UPDATE products SET rating = 4.8, reviews = 376 WHERE name = 'Delta Force Cheat';
UPDATE products SET rating = 4.3, reviews = 127 WHERE name = 'Arc Raiders Cheat';
UPDATE products SET rating = 4.9, reviews = 445 WHERE name = 'Marvel Rivals Cheat';
