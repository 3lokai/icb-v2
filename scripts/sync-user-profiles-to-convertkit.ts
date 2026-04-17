import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { subscribeToConvertKit } from "../src/lib/convertkit/client";

dotenv.config({ path: ".env.local" });

type UserProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  newsletter_subscribed: boolean | null;
  experience_level: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  deleted_at: string | null;
  convertkit_subscriber_id: number | null;
};

type UserRoleRow = {
  user_id: string;
  role: string;
};

type SyncCandidate = {
  id: string;
  email: string;
  first_name: string | null;
  experience_level: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  user_role: string | null;
};

const BATCH_SIZE = 10;
const BATCH_DELAY_MS = 1000;

function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  }

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SECRET_KEY is not set. Service role client cannot be created."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function syncUserProfilesToConvertKit() {
  const dryRun = hasFlag("--dry-run");
  const force = hasFlag("--force");
  const supabase = createServiceRoleClient();

  console.log("Starting user_profiles -> ConvertKit sync");
  console.log(
    `Mode: ${dryRun ? "dry-run" : "live"}${force ? " + force" : ""}\n`
  );

  const { data: profiles, error: profilesError } = await supabase
    .from("user_profiles")
    .select(
      "id, email, full_name, newsletter_subscribed, experience_level, city, state, country, deleted_at, convertkit_subscriber_id"
    )
    .is("deleted_at", null)
    .not("email", "is", null);

  if (profilesError) {
    throw new Error(
      `Failed to fetch user profiles: ${profilesError.message || "Unknown error"}`
    );
  }

  const eligibleProfiles = ((profiles ?? []) as UserProfileRow[]).filter(
    (profile) =>
      profile.email &&
      profile.newsletter_subscribed !== false &&
      (force || profile.convertkit_subscriber_id === null)
  );

  console.log(`Fetched ${profiles?.length || 0} active profiles with email`);
  console.log(`Eligible profiles to sync: ${eligibleProfiles.length}`);

  if (eligibleProfiles.length === 0) {
    console.log("Nothing to sync.");
    return;
  }

  const userIds = eligibleProfiles.map((profile) => profile.id);
  const { data: allRoles, error: rolesError } = await supabase
    .from("user_roles")
    .select("user_id, role")
    .in("user_id", userIds);

  if (rolesError) {
    console.warn(`Warning: could not fetch user roles: ${rolesError.message}`);
  }

  const userRoleMap = new Map<string, string>();
  for (const { user_id, role } of (allRoles ?? []) as UserRoleRow[]) {
    if (!userRoleMap.has(user_id)) {
      userRoleMap.set(user_id, role);
    }
  }

  const candidates: SyncCandidate[] = eligibleProfiles.map((profile) => ({
    id: profile.id,
    email: profile.email!.toLowerCase().trim(),
    first_name: profile.full_name || null,
    experience_level: profile.experience_level,
    city: profile.city,
    state: profile.state,
    country: profile.country,
    user_role: userRoleMap.get(profile.id) || null,
  }));

  let syncedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  let updatedCount = 0;
  let updateErrorCount = 0;

  for (let i = 0; i < candidates.length; i += BATCH_SIZE) {
    const batch = candidates.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(candidates.length / BATCH_SIZE);

    console.log(`\nProcessing batch ${batchNumber}/${totalBatches}...`);

    await Promise.all(
      batch.map(async (candidate) => {
        const location = [candidate.city, candidate.state, candidate.country]
          .filter(Boolean)
          .join(", ");

        if (dryRun) {
          skippedCount++;
          console.log(
            `  [dry-run] ${candidate.email} -> subscribe, then store subscriber ID on ${candidate.id}`
          );
          return;
        }

        try {
          const response = await subscribeToConvertKit({
            email_address: candidate.email,
            first_name: candidate.first_name,
            state: "active",
            fields: {
              "Signup Source": "user-registration",
              ...(candidate.user_role && {
                "User Role": candidate.user_role,
              }),
              ...(candidate.experience_level && {
                "Experience Level": candidate.experience_level,
              }),
              ...(location ? { Location: location } : {}),
            },
          });

          if (!response?.subscriber?.id) {
            errorCount++;
            console.warn(`  No subscriber ID returned for ${candidate.email}`);
            return;
          }

          syncedCount++;

          const { error: updateError } = await supabase
            .from("user_profiles")
            .update({ convertkit_subscriber_id: response.subscriber.id })
            .eq("id", candidate.id);

          if (updateError) {
            updateErrorCount++;
            console.error(
              `  Failed to update subscriber ID for ${candidate.email}:`,
              updateError
            );
            return;
          }

          updatedCount++;
          console.log(
            `  Synced ${candidate.email} -> subscriber ${response.subscriber.id}`
          );
        } catch (error) {
          errorCount++;
          console.error(
            `  Failed syncing ${candidate.email}:`,
            error instanceof Error ? error.message : error
          );
        }
      })
    );

    if (i + BATCH_SIZE < candidates.length) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  console.log("\nSync complete.");
  console.log(`  Synced via Kit: ${syncedCount}`);
  console.log(`  Supabase updates: ${updatedCount}`);
  console.log(`  Dry-run skipped: ${skippedCount}`);
  console.log(`  Sync errors: ${errorCount}`);
  console.log(`  Update errors: ${updateErrorCount}`);
}

syncUserProfilesToConvertKit()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Sync failed:", error);
    process.exit(1);
  });
