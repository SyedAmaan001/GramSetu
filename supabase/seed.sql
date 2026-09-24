-- DEMO DATA — fictional providers for the hackathon prototype, not real
-- businesses. Keep in sync with lib/data/directory-seed.ts.
-- Run after schema.sql, in the Supabase SQL editor.

insert into service_providers (name, category, village, distance_km, phone, available, verified, source, updated_at) values
  ('Ravi Plumbing Works', 'plumber', 'Hosahalli', 3.2, '+91 90000 11111', true, true, 'Village Admin', '2026-09-01'),
  ('Kumar Pipe & Tap Services', 'plumber', 'Hosahalli', 7.1, '+91 90000 11112', false, true, 'Village Admin', '2026-08-20'),
  ('Shankar Plumbing', 'plumber', 'Channapatna', 5.4, '+91 90000 11113', true, false, 'Self-registered', '2026-09-10'),
  ('Manjunath Electricals', 'electrician', 'Hosahalli', 2.8, '+91 90000 22221', true, true, 'Village Admin', '2026-09-05'),
  ('Suresh Electrical Repairs', 'electrician', 'Channapatna', 4.0, '+91 90000 22222', true, true, 'Village Admin', '2026-08-28'),
  ('Prakash Motors & Repair', 'mechanic', 'Hosahalli', 6.5, '+91 90000 33331', true, true, 'Village Admin', '2026-09-02'),
  ('Ganesh Auto Works', 'mechanic', 'Doddaballapur', 12.0, '+91 90000 33332', true, false, 'Self-registered', '2026-09-11'),
  ('Lakshmi Tailoring', 'tailor', 'Hosahalli', 1.5, '+91 90000 44441', true, true, 'Village Admin', '2026-08-15'),
  ('Basavaraj Carpentry', 'carpenter', 'Channapatna', 3.9, '+91 90000 55551', true, true, 'Village Admin', '2026-09-08'),
  ('Nagaraj Carpentry & Furniture', 'carpenter', 'Doddaballapur', 9.3, '+91 90000 55552', false, true, 'Village Admin', '2026-07-30'),
  ('Anitha Beauty Parlour', 'beautician', 'Hosahalli', 2.1, '+91 90000 66661', true, true, 'Village Admin', '2026-09-12'),
  ('Ramesh Borewell Services', 'borewell', 'Channapatna', 8.7, '+91 90000 77771', true, true, 'Village Admin', '2026-09-03'),
  ('Krishna Painting Works', 'painter', 'Hosahalli', 4.6, '+91 90000 88881', true, false, 'Self-registered', '2026-09-09'),
  ('Venkatesh AC & Fridge Repair', 'appliance repair', 'Doddaballapur', 10.5, '+91 90000 99991', true, true, 'Village Admin', '2026-08-25'),
  ('Muniraju Masonry', 'mason', 'Channapatna', 6.0, '+91 90000 10101', true, true, 'Village Admin', '2026-09-06');
