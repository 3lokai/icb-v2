/**
 * Slack notification utility
 *
 * Sends formatted notifications to Slack via webhook URL.
 * All notifications are fire-and-forget (non-blocking).
 */

type NotificationType = "signup" | "review" | "form";

type SignupPayload = {
  email: string;
  name?: string;
  method: "email" | "google" | "facebook";
};

type ReviewPayload = {
  entity_type: "coffee" | "roaster";
  entity_id: string;
  rating?: number | null;
  user_type: "authenticated" | "anonymous";
  user_id?: string | null;
};

type FormPayload = {
  form_type:
    | "roaster_submission"
    | "suggestion"
    | "professional_inquiry"
    | "roaster_claim"
    | "partner_inquiry";
  email: string | null;
  data: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  user_id: string | null;
};

type NotificationPayload = SignupPayload | ReviewPayload | FormPayload;

/**
 * Format Slack message based on notification type
 */
function formatSlackMessage(
  type: NotificationType,
  payload: NotificationPayload
): { text: string; blocks?: unknown[] } {
  switch (type) {
    case "signup": {
      const signupPayload = payload as SignupPayload;
      const name = signupPayload.name || "Unknown";
      const method =
        signupPayload.method === "email"
          ? "Email/Password"
          : signupPayload.method.toUpperCase();

      return {
        text: `New user signup: ${signupPayload.email} (${name}) via ${method}`,
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "🎉 New User Signup",
            },
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Email:*\n${signupPayload.email}`,
              },
              {
                type: "mrkdwn",
                text: `*Name:*\n${name}`,
              },
              {
                type: "mrkdwn",
                text: `*Method:*\n${method}`,
              },
            ],
          },
        ],
      };
    }

    case "review": {
      const reviewPayload = payload as ReviewPayload;
      const entityType =
        reviewPayload.entity_type === "coffee" ? "Coffee" : "Roaster";
      const userType =
        reviewPayload.user_type === "authenticated"
          ? "Authenticated User"
          : "Anonymous User";
      const ratingText = reviewPayload.rating
        ? `${reviewPayload.rating}/5`
        : "No rating";

      return {
        text: `New review: ${entityType} ${reviewPayload.entity_id} - Rating: ${ratingText} by ${userType}`,
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "⭐ New Review Submitted",
            },
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Entity Type:*\n${entityType}`,
              },
              {
                type: "mrkdwn",
                text: `*Entity ID:*\n\`${reviewPayload.entity_id}\``,
              },
              {
                type: "mrkdwn",
                text: `*Rating:*\n${ratingText}`,
              },
              {
                type: "mrkdwn",
                text: `*User Type:*\n${userType}`,
              },
            ],
          },
        ],
      };
    }

    case "form": {
      const formPayload = payload as FormPayload;
      const formTypeLabels: Record<FormPayload["form_type"], string> = {
        roaster_submission: "Roaster Submission",
        suggestion: "Suggestion",
        professional_inquiry: "Professional Inquiry",
        roaster_claim: "Roaster Claim Request",
        partner_inquiry: "Partner Inquiry",
      };

      const formTypeLabel = formTypeLabels[formPayload.form_type];

      // Build form fields section
      const formFields: { type: string; text: string }[] = [];

      // Add all form data fields
      Object.entries(formPayload.data).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          const formattedKey = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())
            .trim();
          formFields.push({
            type: "mrkdwn",
            text: `*${formattedKey}:*\n${String(value).substring(0, 500)}${String(value).length > 500 ? "..." : ""}`,
          });
        }
      });

      const blocks: unknown[] = [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `📝 ${formTypeLabel}`,
          },
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Form Type:*\n${formTypeLabel}`,
            },
            {
              type: "mrkdwn",
              text: `*Email:*\n${formPayload.email || "N/A"}`,
            },
            ...(formPayload.user_id
              ? [
                  {
                    type: "mrkdwn",
                    text: `*User ID:*\n\`${formPayload.user_id}\``,
                  },
                ]
              : []),
          ],
        },
      ];

      // Add form data fields
      if (formFields.length > 0) {
        // Split into chunks of 2 fields per section (Slack limit)
        for (let i = 0; i < formFields.length; i += 2) {
          blocks.push({
            type: "section",
            fields: formFields.slice(i, i + 2),
          });
        }
      }

      // Add metadata section
      const metadataFields: { type: string; text: string }[] = [];

      if (formPayload.ip_address) {
        metadataFields.push({
          type: "mrkdwn",
          text: `*IP Address:*\n\`${formPayload.ip_address}\``,
        });
      }

      if (formPayload.user_agent) {
        metadataFields.push({
          type: "mrkdwn",
          text: `*User Agent:*\n${formPayload.user_agent.substring(0, 100)}${formPayload.user_agent.length > 100 ? "..." : ""}`,
        });
      }

      if (metadataFields.length > 0) {
        blocks.push({
          type: "section",
          fields: metadataFields,
        });
      }

      return {
        text: `${formTypeLabel} submitted by ${formPayload.email || "Unknown"}`,
        blocks,
      };
    }

    default:
      return {
        text: "Unknown notification type",
      };
  }
}

/**
 * Get the appropriate webhook URL based on notification type
 */
function getWebhookUrl(
  type: NotificationType,
  payload?: NotificationPayload
): string | undefined {
  // Roaster-related forms go to roasters channel
  if (type === "form" && payload) {
    const formPayload = payload as FormPayload;
    const roasterFormTypes: FormPayload["form_type"][] = [
      "roaster_submission",
      "roaster_claim",
      "partner_inquiry",
    ];
    if (roasterFormTypes.includes(formPayload.form_type)) {
      return process.env.SLACK_WEBHOOK_URL_ROASTERS;
    }
  }

  // Other forms go to forms channel
  if (type === "form") {
    return process.env.SLACK_WEBHOOK_URL_FORMS;
  }

  // Signups and reviews go to activity channel
  return process.env.SLACK_WEBHOOK_URL_ACTIVITY;
}

/**
 * Send notification to Slack
 *
 * This function is fire-and-forget and will not throw errors.
 * Errors are logged but do not affect the calling code.
 *
 * Channel routing:
 * - Signups and reviews → SLACK_WEBHOOK_URL_ACTIVITY
 * - Roaster forms (submission, claim, partner_inquiry) → SLACK_WEBHOOK_URL_ROASTERS
 * - Other forms → SLACK_WEBHOOK_URL_FORMS
 */
export async function sendSlackNotification(
  type: NotificationType,
  payload: NotificationPayload
): Promise<void> {
  const webhookUrl = getWebhookUrl(type, payload);

  // Silently return if webhook URL is not configured
  if (!webhookUrl) {
    if (process.env.NODE_ENV === "development") {
      let channelName = "activity";
      if (type === "form" && payload) {
        const formPayload = payload as FormPayload;
        const roasterFormTypes: FormPayload["form_type"][] = [
          "roaster_submission",
          "roaster_claim",
          "partner_inquiry",
        ];
        channelName = roasterFormTypes.includes(formPayload.form_type)
          ? "roasters"
          : "forms";
      }
      console.log(
        `[Slack] ${channelName} webhook URL not configured, skipping notification`
      );
    }
    return;
  }

  try {
    const message = formatSlackMessage(type, payload);

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      console.error(
        `[Slack] Notification failed: ${response.status} ${errorText}`
      );
    }
  } catch (error) {
    // Log error but don't throw - notifications should never break the app
    console.error("[Slack] Failed to send notification:", error);
  }
}
