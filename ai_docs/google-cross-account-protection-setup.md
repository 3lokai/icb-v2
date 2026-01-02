# 🔐 Google Cross-Account Protection (RISC) Setup Guide

## What is Cross-Account Protection?

Cross-Account Protection (also known as RISC - Risk Information Sharing Consortium) is an **optional** security feature from Google that helps protect user accounts by:

- Receiving security event notifications from Google when suspicious activity is detected
- Allowing your application to respond to potential security incidents
- Enhancing overall account security through threat intelligence sharing

## ⚠️ Important: This is Optional

**You do NOT need to configure Cross-Account Protection for basic OAuth functionality to work.** Your Google OAuth sign-in will work perfectly fine without it.

However, enabling it provides additional security benefits and is recommended for production applications handling sensitive user data.

---

## When to Enable Cross-Account Protection

### ✅ Enable if:
- You're handling sensitive user data
- You want enhanced security monitoring
- You want to respond to security events automatically
- You're building a production application with high security requirements

### ⏭️ Skip if:
- You're in development/testing phase
- You want to keep the setup simple
- You don't need advanced security event monitoring
- You're just getting started with OAuth

---

## Configuration Steps (If You Want to Enable)

### Step 1: Enable RISC API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project (IndianCoffeeBeans)
3. Navigate to **APIs & Services** > **Library**
4. Search for **"RISC API"** or go to: https://console.developers.google.com/apis/library/risc.googleapis.com
5. Click **Enable**
6. Review and accept the RISC Terms of Service

### Step 2: Create Service Account

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **Service Account**
3. Fill in the details:
   - **Service account name**: `risc-config-admin`
   - **Service account ID**: `risc-config-admin` (auto-generated)
   - **Description**: "Service account for RISC Cross-Account Protection configuration"
4. Click **Create and Continue**
5. **Grant this service account access to project**:
   - Role: **RISC Configuration Admin** (`roles/riscconfigs.admin`)
6. Click **Continue** > **Done**

### Step 3: Generate Service Account Key

1. In the **Credentials** page, find your service account
2. Click on the service account email
3. Go to the **Keys** tab
4. Click **Add Key** > **Create new key**
5. Choose **JSON** format
6. Click **Create** (key will download automatically)
7. **Store this key securely** - you'll need it for the next step

### Step 4: Create Event Receiver Endpoint

You need to create an endpoint in your application to receive security event tokens from Google.

**Option A: Create a new endpoint** (Recommended)

Create: `src/app/api/webhooks/risc/route.ts`

```typescript
import { type NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

/**
 * RISC (Cross-Account Protection) Event Receiver
 * 
 * This endpoint receives security event notifications from Google
 * when suspicious activity is detected on user accounts.
 * 
 * @see https://developers.google.com/identity/protocols/risc
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verify the event token (JWT verification required)
    // TODO: Implement JWT verification using Google's public keys
    // See: https://www.googleapis.com/oauth2/v3/certs
    
    const { events } = body;
    
    if (!events || !Array.isArray(events)) {
      return NextResponse.json(
        { error: "Invalid event format" },
        { status: 400 }
      );
    }
    
    // Process each security event
    for (const event of events) {
      const { subject, events: eventList } = event;
      
      // subject is the user's Google account identifier
      // eventList contains security events like:
      // - account-disabled
      // - account-enabled
      // - credentials-compromised
      // - session-revoked
      
      // Find user by Google provider ID
      const supabase = await createServiceRoleClient();
      const { data: { users }, error } = await supabase.auth.admin.listUsers();
      
      if (error || !users) {
        console.error("Error listing users for RISC event:", error);
        continue;
      }
      
      // Find user with matching Google identity
      for (const user of users) {
        const identity = user.identities?.find(
          (id) => id.provider === "google" && id.id === subject
        );
        
        if (identity) {
          // Handle security events
          for (const securityEvent of eventList) {
            await handleSecurityEvent(user.id, securityEvent, supabase);
          }
          break;
        }
      }
    }
    
    return NextResponse.json({ status: "processed" });
  } catch (error) {
    console.error("RISC event processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleSecurityEvent(
  userId: string,
  event: any,
  supabase: any
) {
  const eventType = event["https://schemas.openid.net/secevent/risc/event-type/credential-compromised"];
  
  switch (eventType) {
    case "account-disabled":
      // Disable user account in your system
      console.log(`Account disabled for user: ${userId}`);
      // Optionally: await supabase.auth.admin.updateUserById(userId, { ban_duration: '876000h' });
      break;
      
    case "credentials-compromised":
      // Force password reset or disable account
      console.log(`Credentials compromised for user: ${userId}`);
      // Optionally: Force logout all sessions
      // await supabase.auth.admin.signOut(userId);
      break;
      
    case "session-revoked":
      // Revoke user session
      console.log(`Session revoked for user: ${userId}`);
      break;
      
    default:
      console.log(`Unhandled security event: ${eventType} for user: ${userId}`);
  }
}

// GET endpoint for verification (Google may use this)
export async function GET(_request: NextRequest) {
  return NextResponse.json({
    message: "RISC event receiver endpoint",
    status: "active",
  });
}
```

**Option B: Use existing data-deletion endpoint**

You could extend your existing `src/app/api/webhooks/data-deletion/route.ts` to handle RISC events, but it's better to keep them separate for clarity.

### Step 5: Register Endpoint with Google

1. Install Google API client library (if not already installed):
   ```bash
   npm install googleapis
   ```

2. Create a registration script: `scripts/register-risc-endpoint.ts`

```typescript
import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Register RISC endpoint with Google
 * 
 * Run this script once to register your endpoint:
 * npx tsx scripts/register-risc-endpoint.ts
 */

async function registerRISCEndpoint() {
  // Load service account key (from Step 3)
  const keyPath = path.join(process.cwd(), 'google-service-account-key.json');
  const key = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  
  // Authenticate with service account
  const auth = new google.auth.GoogleAuth({
    credentials: key,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  
  const authClient = await auth.getClient();
  
  // Register endpoint
  const risc = google.risc({
    version: 'v1beta',
    auth: authClient,
  });
  
  const endpointUrl = 'https://indiancoffeebeans.com/api/webhooks/risc';
  
  try {
    const response = await risc.projects.flows.create({
      parent: `projects/${key.project_id}`,
      requestBody: {
        name: `projects/${key.project_id}/flows/risc-endpoint`,
        config: {
          deliveryEndpoint: {
            url: endpointUrl,
          },
        },
      },
    });
    
    console.log('✅ RISC endpoint registered successfully!');
    console.log('Flow ID:', response.data.name);
  } catch (error: any) {
    console.error('❌ Error registering RISC endpoint:', error);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

registerRISCEndpoint();
```

3. Run the registration script:
   ```bash
   npx tsx scripts/register-risc-endpoint.ts
   ```

### Step 6: Verify Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** > **Credentials**
3. Check that the warning message is gone
4. You should see your RISC configuration listed

---

## Security Considerations

### JWT Token Verification

**IMPORTANT**: The example code above includes a TODO for JWT verification. In production, you MUST verify the JWT tokens from Google before processing events.

```typescript
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const client = jwksClient({
  jwksUri: 'https://www.googleapis.com/oauth2/v3/certs'
});

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

async function verifyRISCJWT(token: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, {
      audience: 'https://indiancoffeebeans.com/api/webhooks/risc',
      issuer: 'https://accounts.google.com',
    }, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
}
```

### Rate Limiting

Add rate limiting to your RISC endpoint to prevent abuse:

```typescript
// Add rate limiting middleware
// Consider using a library like 'express-rate-limit' or similar
```

---

## Testing

1. **Test endpoint accessibility**:
   ```bash
   curl https://indiancoffeebeans.com/api/webhooks/risc
   ```

2. **Monitor logs** for incoming events (Google will send test events periodically)

3. **Verify event processing** in your application logs

---

## Troubleshooting

### "Your project is not configured for Cross-Account Protection"

This is just an informational message. Your OAuth will work fine without it. If you want to remove the message:

1. Follow the configuration steps above, OR
2. Ignore it (it doesn't affect functionality)

### Endpoint not receiving events

- Verify the endpoint is publicly accessible (no authentication required for POST)
- Check that the endpoint URL is correctly registered
- Verify service account has correct permissions
- Check application logs for errors

### JWT verification failing

- Ensure you're using the correct Google public keys endpoint
- Verify the token audience matches your endpoint URL
- Check token expiration

---

## References

- [Google RISC Documentation](https://developers.google.com/identity/protocols/risc)
- [Cross-Account Protection Guide](https://developers.google.com/identity/protocols/risc/account-protection)
- [RISC API Reference](https://developers.google.com/identity/protocols/risc/api-reference)

---

## Summary

- ✅ **Cross-Account Protection is OPTIONAL** - your OAuth works without it
- ✅ **Enable it if** you want enhanced security monitoring
- ✅ **Skip it if** you want to keep setup simple
- ✅ **Follow the steps above** if you decide to enable it

The warning message in Google Console is informational and doesn't affect your OAuth functionality.

