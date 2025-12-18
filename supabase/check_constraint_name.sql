-- Check the actual constraint name for user_profiles primary key
SELECT 
    conname AS constraint_name,
    contype AS constraint_type,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.user_profiles'::regclass
  AND contype = 'p'  -- 'p' = primary key constraint
ORDER BY conname;

