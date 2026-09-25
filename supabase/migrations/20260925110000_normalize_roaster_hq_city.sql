-- Migration: Normalize roaster HQ city/state spellings
-- Description: One-off cleanup so /learn/insights "Where India Roasts" groups
--   roasters correctly. Variants fold into the official city names, matching
--   the manual roaster-table cleanup of 2026-09-25.

UPDATE roasters SET hq_city = 'Bengaluru' WHERE hq_city = 'Bangalore';
UPDATE roasters SET hq_city = 'Mysuru' WHERE hq_city = 'Mysore';
UPDATE roasters SET hq_city = 'New Delhi' WHERE hq_city = 'Delhi';
UPDATE roasters SET hq_state = 'Delhi' WHERE hq_state = 'New Delhi';
UPDATE roasters SET hq_city = 'Gurugram' WHERE hq_city = 'Gurgaon';
UPDATE roasters SET hq_city = 'Bhubaneswar' WHERE hq_city = 'Bhubaneshwar';
UPDATE roasters SET hq_state = 'Odisha' WHERE hq_state = 'Orissa';
UPDATE roasters
SET hq_city = 'Chikkamagaluru', hq_state = 'Karnataka'
WHERE hq_city IN ('Chikmagalur', 'Chikamagaluru', 'Chikamagluru');
