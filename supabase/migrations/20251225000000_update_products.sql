-- Clear old products
DELETE FROM public.products;

-- Insert new gaming products with variants support
INSERT INTO public.products (name, description, price, category, status, features, is_featured) VALUES
('PUBG', 'Powerful PUBG suite for both ranked and casual.', 5.90, 'cheats', 'undetected', ARRAY['ESP', 'Aimbot', 'No Recoil', 'Radar', 'Undetected'], true),
('Arc Raiders', 'Premium advantage suite for Arc Raiders.', 8.90, 'cheats', 'undetected', ARRAY['ESP', 'Aimbot', 'Loot ESP', 'Player ESP', 'Safe'], true),
('Marvel Rivals', 'Competitive tools for Marvel Rivals ranked play.', 10.90, 'cheats', 'undetected', ARRAY['Aimbot', 'ESP', 'Ability ESP', 'Ultimate Tracker', 'Undetected'], true),
('BO7', 'High-impact suite for Black Ops 7.', 7.90, 'cheats', 'undetected', ARRAY['Aimbot', 'Wallhack', 'Radar', 'No Recoil', 'Safe Mode'], false),
('Rust', 'Undetected Rust tool focused on legit gameplay.', 9.90, 'cheats', 'undetected', ARRAY['ESP', 'Aimbot', 'Loot ESP', 'Player ESP', 'Anti-Aim'], false),
('Fortnite', 'Smooth, low-FOV Fortnite advantage built for wins.', 11.90, 'cheats', 'undetected', ARRAY['Aimbot', 'ESP', 'Loot ESP', 'Build ESP', 'Undetected'], true),
('Fortnite Accounts (Full Access)', 'Instant full-access Fortnite accounts with rare skins.', 15.99, 'accounts', 'undetected', ARRAY['Full Access', 'Rare Skins', 'Instant Delivery', 'Warranty', 'Email Changeable'], true),
('Apex Legends', 'Configurable Apex Legends suite for ranked grinders.', 7.90, 'cheats', 'undetected', ARRAY['Aimbot', 'ESP', 'Glow ESP', 'Item ESP', 'Safe'], false),
('Valorant', 'Low-Risk Valorant tool with clean wall info and helpers.', 7.90, 'cheats', 'undetected', ARRAY['ESP', 'Aimbot', 'Triggerbot', 'Radar', 'Undetected'], false),
('HWID Spoofer', 'Clean slate HWID spoofer for supported games.', 19.99, 'tools', 'undetected', ARRAY['HWID Spoof', 'Instant', 'Safe', 'Multi-Game', 'Unban'], true),
('Battlefield 6', 'Large-scale Battlefield 6 tool with conquest and beyond.', 11.99, 'cheats', 'undetected', ARRAY['Aimbot', 'ESP', 'Vehicle ESP', 'Radar', 'Undetected'], false),
('Rainbow Six Siege', 'Tactical R6 tool with clean wall info and helpers.', 6.99, 'cheats', 'undetected', ARRAY['ESP', 'Aimbot', 'Gadget ESP', 'Recoil Control', 'Safe'], false),
('Delta Force', 'Next-gen Delta Force advantage pack.', 7.90, 'cheats', 'undetected', ARRAY['ESP', 'Aimbot', 'Loot ESP', 'Player ESP', 'Undetected'], true);
