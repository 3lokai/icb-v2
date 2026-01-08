import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

/**
 * Create a Supabase client with service role (bypasses RLS)
 * Standalone version for migration scripts (doesn't require Next.js)
 */
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

/**
 * ConvertKit/Kit API Types
 */
type KitSubscriberState =
  | "active"
  | "cancelled"
  | "bounced"
  | "complained"
  | "inactive";

interface KitSubscriberFields {
  "Signup Source"?: string;
  "User Role"?: string;
  "Experience Level"?: string;
  Location?: string;
  [key: string]: string | undefined;
}

interface SubscribeToConvertKitParams {
  email_address: string;
  first_name?: string | null;
  state?: KitSubscriberState;
  fields?: KitSubscriberFields;
}

interface KitSubscriberResponse {
  subscriber: {
    id: number;
    first_name: string | null;
    email_address: string;
    state: KitSubscriberState;
    created_at: string;
    fields: Record<string, unknown>;
  };
}

interface KitErrorResponse {
  errors: string[];
}

/**
 * Subscribe a user to ConvertKit (upsert behavior)
 * Standalone version for migration scripts
 */
async function subscribeToConvertKit(
  params: SubscribeToConvertKitParams
): Promise<KitSubscriberResponse | null> {
  const apiKey = process.env.KIT_API_KEY;

  if (!apiKey) {
    console.log("[ConvertKit] API key not configured, skipping subscription");
    return null;
  }

  const apiUrl = "https://api.kit.com/v4/subscribers";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Kit-Api-Key": apiKey,
      },
      body: JSON.stringify({
        email_address: params.email_address.toLowerCase().trim(),
        first_name: params.first_name || null,
        state: params.state || "active",
        fields: params.fields || {},
      }),
    });

    // Handle different response codes
    if (
      response.status === 200 ||
      response.status === 201 ||
      response.status === 202
    ) {
      const data = (await response.json()) as KitSubscriberResponse;
      return data;
    }

    // Handle error responses
    if (response.status === 401) {
      const errorData = (await response.json()) as KitErrorResponse;
      console.error("[ConvertKit] Authentication error:", errorData.errors);
      return null;
    }

    if (response.status === 422) {
      const errorData = (await response.json()) as KitErrorResponse;
      console.error("[ConvertKit] Validation error:", errorData.errors);
      return null;
    }

    // Handle rate limiting (429)
    if (response.status === 429) {
      console.warn("[ConvertKit] Rate limit exceeded, skipping subscription");
      return null;
    }

    // Handle other errors
    const errorText = await response.text();
    console.error(
      `[ConvertKit] Unexpected error (${response.status}):`,
      errorText
    );
    return null;
  } catch (error) {
    // Network errors, etc. - fail silently
    console.error(
      "[ConvertKit] Network error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return null;
  }
}

type SubscriberData = {
  email: string;
  first_name: string | null;
  user_id: string | null;
  signup_source: string;
  experience_level: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  user_role: string | null;
};

async function migrateToConvertKit() {
  const supabase = createServiceRoleClient();

  console.log("🚀 Starting ConvertKit migration...\n");

  // 1. Get all newsletter form submissions
  const { data: newsletterSubmissions, error: submissionsError } =
    await supabase
      .from("form_submissions")
      .select("email, data, user_id, created_at")
      .eq("form_type", "newsletter")
      .not("email", "is", null);

  if (submissionsError) {
    console.error(
      "❌ Error fetching newsletter submissions:",
      submissionsError
    );
    return;
  }

  console.log(
    `📧 Found ${newsletterSubmissions?.length || 0} newsletter form submissions`
  );

  // 2. Get all users with newsletter_subscribed = true (with full profile data)
  const { data: subscribedUsers, error: usersError } = await supabase
    .from("user_profiles")
    .select(
      "id, email, full_name, newsletter_subscribed, experience_level, city, state, country"
    )
    .eq("newsletter_subscribed", true)
    .not("email", "is", null);

  if (usersError) {
    console.error("❌ Error fetching subscribed users:", usersError);
    return;
  }

  console.log(
    `👥 Found ${subscribedUsers?.length || 0} users with newsletter_subscribed = true\n`
  );

  // 3. Get all user roles (for custom fields)
  const { data: allRoles, error: rolesError } = await supabase
    .from("user_roles")
    .select("user_id, role");

  if (rolesError) {
    console.warn("⚠️  Warning: Could not fetch user roles:", rolesError);
  }

  // Create a map of user_id -> primary role
  const userRoleMap = new Map<string, string>();
  if (allRoles) {
    allRoles.forEach(({ user_id, role }) => {
      // Use first role found (or you could prioritize admin > operator > etc.)
      if (!userRoleMap.has(user_id)) {
        userRoleMap.set(user_id, role);
      }
    });
  }

  // 4. Combine and deduplicate by email
  const emailMap = new Map<string, SubscriberData>();

  // Add newsletter form submissions
  newsletterSubmissions?.forEach((submission) => {
    const email = submission.email?.toLowerCase().trim();
    if (email) {
      const name = (submission.data as any)?.name || null;
      emailMap.set(email, {
        email,
        first_name: name,
        user_id: submission.user_id || null,
        signup_source: "newsletter-signup",
        experience_level: null,
        city: null,
        state: null,
        country: null,
        user_role: submission.user_id
          ? userRoleMap.get(submission.user_id) || null
          : null,
      });
    }
  });

  // Add subscribed users (form submissions take precedence for name)
  subscribedUsers?.forEach((user) => {
    const email = user.email?.toLowerCase().trim();
    if (email) {
      const existing = emailMap.get(email);
      if (existing) {
        // Update with user profile data if available
        existing.user_id = existing.user_id || user.id;
        existing.first_name = existing.first_name || user.full_name || null;
        existing.experience_level = user.experience_level;
        existing.city = user.city;
        existing.state = user.state;
        existing.country = user.country;
        existing.user_role =
          existing.user_role || userRoleMap.get(user.id) || null;
      } else {
        emailMap.set(email, {
          email,
          first_name: user.full_name || null,
          user_id: user.id,
          signup_source: "user-registration",
          experience_level: user.experience_level,
          city: user.city,
          state: user.state,
          country: user.country,
          user_role: userRoleMap.get(user.id) || null,
        });
      }
    }
  });

  console.log(`📊 Total unique emails to migrate: ${emailMap.size}\n`);

  // 5. Subscribe to ConvertKit in batches (to avoid rate limits)
  const subscribers = Array.from(emailMap.values());
  const batchSize = 10; // Adjust based on ConvertKit rate limits
  let successCount = 0;
  let errorCount = 0;
  const subscriberIdUpdates: Array<{ user_id: string; subscriber_id: number }> =
    [];

  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize);
    console.log(
      `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(subscribers.length / batchSize)}...`
    );

    await Promise.all(
      batch.map(async (subscriber) => {
        try {
          const response = await subscribeToConvertKit({
            email_address: subscriber.email,
            first_name: subscriber.first_name,
            state: "active",
            fields: {
              "Signup Source": subscriber.signup_source,
              ...(subscriber.user_role && {
                "User Role": subscriber.user_role,
              }),
              ...(subscriber.experience_level && {
                "Experience Level": subscriber.experience_level,
              }),
              ...(subscriber.city || subscriber.state || subscriber.country
                ? {
                    Location: [
                      subscriber.city,
                      subscriber.state,
                      subscriber.country,
                    ]
                      .filter(Boolean)
                      .join(", "),
                  }
                : {}),
            },
          });

          if (response?.subscriber?.id) {
            successCount++;
            console.log(
              `  ✅ ${subscriber.email} (${subscriber.signup_source}) - ID: ${response.subscriber.id}`
            );

            // Store subscriber ID for batch update
            if (subscriber.user_id) {
              subscriberIdUpdates.push({
                user_id: subscriber.user_id,
                subscriber_id: response.subscriber.id,
              });
            }
          } else {
            errorCount++;
            console.warn(
              `  ⚠️  ${subscriber.email} - No subscriber ID returned`
            );
          }
        } catch (error) {
          errorCount++;
          console.error(`  ❌ ${subscriber.email}:`, error);
        }
      })
    );

    // Small delay between batches to respect rate limits
    if (i + batchSize < subscribers.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  // 6. Update subscriber IDs in database
  if (subscriberIdUpdates.length > 0) {
    console.log(
      `\n💾 Storing subscriber IDs for ${subscriberIdUpdates.length} users...`
    );
    let updateCount = 0;
    let updateErrorCount = 0;

    for (const { user_id, subscriber_id } of subscriberIdUpdates) {
      const { error } = await supabase
        .from("user_profiles")
        .update({ convertkit_subscriber_id: subscriber_id })
        .eq("id", user_id);

      if (error) {
        updateErrorCount++;
        console.error(
          `  ❌ Failed to update subscriber ID for user ${user_id}:`,
          error
        );
      } else {
        updateCount++;
      }
    }

    console.log(`   ✅ Updated: ${updateCount}`);
    if (updateErrorCount > 0) {
      console.log(`   ❌ Update errors: ${updateErrorCount}`);
    }
  }

  console.log(`\n✨ Migration complete!`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
}

// Run the migration
migrateToConvertKit()
  .then(() => {
    console.log("\n🎉 Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Migration failed:", error);
    process.exit(1);
  });
