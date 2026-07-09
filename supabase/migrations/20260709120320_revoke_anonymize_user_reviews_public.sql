-- Missed in 20260709120310: anonymize_user_reviews is only ever called via
-- createServiceRoleClient() (src/app/actions/account.ts, the data-deletion
-- webhook), but still held EXECUTE via the default PUBLIC grant. Same fix.
REVOKE EXECUTE ON FUNCTION public.anonymize_user_reviews(p_user_id uuid) FROM PUBLIC;
