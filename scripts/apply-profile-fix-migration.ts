/**
 * Script to apply the profile update fix migration
 * This adds username and bio parameters to the upsert_user_profile RPC function
 *
 * Run with: npx tsx scripts/apply-profile-fix-migration.ts
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase credentials");
  console.error(
    "Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  try {
    console.log("📖 Reading migration file...");

    const migrationPath = join(
      process.cwd(),
      "supabase",
      "migrations",
      "20260129120000_fix_upsert_user_profile_add_username_bio.sql"
    );

    const sql = readFileSync(migrationPath, "utf-8");

    console.log("🔄 Applying migration...");

    const { error } = await supabase.rpc("exec_sql", { sql });

    if (error) {
      console.error("❌ Migration failed:", error);

      // Try applying directly if exec_sql doesn't exist
      console.log("🔄 Trying direct SQL execution...");
      const { error: directError } = await supabase
        .from("_migrations")
        .select("*")
        .limit(1);

      if (directError) {
        console.error("❌ Could not apply migration automatically.");
        console.log(
          "\n📋 Please apply this migration manually in Supabase SQL Editor:"
        );
        console.log(
          "1. Go to: https://supabase.com/dashboard/project/fnpsnzqedznsgzxjsowe/sql/new"
        );
        console.log("2. Copy and paste the SQL from:");
        console.log(
          "   supabase/migrations/20260129120000_fix_upsert_user_profile_add_username_bio.sql"
        );
        console.log("3. Run the query");
        process.exit(1);
      }
    } else {
      console.log("✅ Migration applied successfully!");
    }
  } catch (error) {
    console.error("❌ Error:", error);
    console.log(
      "\n📋 Please apply this migration manually in Supabase SQL Editor:"
    );
    console.log(
      "1. Go to: https://supabase.com/dashboard/project/fnpsnzqedznsgzxjsowe/sql/new"
    );
    console.log("2. Copy and paste the SQL from:");
    console.log(
      "   supabase/migrations/20260129120000_fix_upsert_user_profile_add_username_bio.sql"
    );
    console.log("3. Run the query");
    process.exit(1);
  }
}

applyMigration();
