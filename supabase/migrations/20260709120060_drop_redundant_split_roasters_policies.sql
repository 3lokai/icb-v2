-- Second follow-up to 20260709120000: the "Admins can manage roasters" ALL policy
-- was split into insert/update/delete pieces, but `roasters` already had separate
-- "Admins can create/update/delete roasters" policies with the identical admin
-- check (and "Members can edit roasters" already merged into roasters_update_merged,
-- a superset of the admin check). The split pieces are pure duplicates now -
-- drop them, no replacement needed.
DROP POLICY IF EXISTS "Admins can manage roasters (insert)" ON public.roasters;
DROP POLICY IF EXISTS "Admins can manage roasters (update)" ON public.roasters;
DROP POLICY IF EXISTS "Admins can manage roasters (delete)" ON public.roasters;
