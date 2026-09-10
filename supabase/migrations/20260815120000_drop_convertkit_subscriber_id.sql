-- Newsletter moved from ConvertKit/Kit to Notifuse. Notifuse identifies contacts
-- by email (external_id = user_profiles.id), so there is no subscriber ID to keep.
alter table public.user_profiles drop column if exists convertkit_subscriber_id;
