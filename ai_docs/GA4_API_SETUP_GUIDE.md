# 🔧 GA4 Management API Setup Guide

This guide walks you through setting up GA4 custom dimensions and conversion events using the automated setup script.

---

## 📋 Prerequisites

- Google Cloud Project with billing enabled
- GA4 Property ID (numeric or G-XXXXXXXXXX format)
- Admin access to the GA4 property
- Node.js and npm installed

---

## 🚀 Step 1: Create Google Cloud Service Account

### 1.1 Navigate to Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project (or create a new one)
3. Navigate to **IAM & Admin** > **Service Accounts**

### 1.2 Create Service Account

1. Click **Create Service Account**
2. Fill in details:
   - **Service account name**: `ga4-setup-admin`
   - **Service account ID**: `ga4-setup-admin` (auto-generated)
   - **Description**: "Service account for GA4 automated setup"
3. Click **Create and Continue**

### 1.3 Grant Permissions

1. In **Grant this service account access to project**:
   - Click **Add Role**
   - Select **Analytics Admin** (`roles/analytics.admin`)
   - Click **Add Another Role**
   - Select **Service Account User** (`roles/iam.serviceAccountUser`)
2. Click **Continue** > **Done**

### 1.4 Generate Service Account Key

1. Find your service account in the list
2. Click on the service account email
3. Go to the **Keys** tab
4. Click **Add Key** > **Create new key**
5. Choose **JSON** format
6. Click **Create** (key will download automatically)
7. **Store this key securely** - you'll need it for the next step

---

## 🔑 Step 2: Configure Environment Variables

### 2.1 Get Your GA4 Property ID

1. Go to [Google Analytics](https://analytics.google.com)
2. Select your GA4 property
3. Go to **Admin** (gear icon) > **Property Settings**
4. Copy the **Property ID** (numeric format like `123456789` or `G-XXXXXXXXXX`)

### 2.2 Add to .env.local

Create or update your `.env.local` file:

```bash
# GA4 Property ID (numeric or G-XXXXXXXXXX format)
GA4_PROPERTY_ID=123456789

# Service Account Key (choose ONE option below)

# Option 1: Path to JSON key file (recommended for local development)
GOOGLE_SERVICE_ACCOUNT_KEY=./google-service-account-key.json

# Option 2: JSON key as string (for CI/CD or if you prefer)
# GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"..."}'

# Google Cloud Project ID (optional, for validation)
GOOGLE_CLOUD_PROJECT_ID=your-project-id
```

### 2.3 Secure Your Service Account Key

**Important Security Notes:**

- ✅ **DO** add `google-service-account-key.json` to `.gitignore`
- ✅ **DO** store keys securely (never commit to git)
- ✅ **DO** use environment variables in production
- ❌ **DON'T** commit service account keys to version control
- ❌ **DON'T** share keys publicly

Add to `.gitignore`:

```gitignore
# Google Service Account Keys
google-service-account-key.json
*-service-account-key.json
*.json
!package.json
!package-lock.json
!tsconfig.json
```

---

## 🎯 Step 3: Grant Service Account Access to GA4

### 3.1 Add Service Account to GA4

1. Go to [Google Analytics](https://analytics.google.com)
2. Select your GA4 property
3. Go to **Admin** > **Property Access Management**
4. Click **+** (Add users)
5. Enter your service account email (from Step 1.4)
6. Select role: **Administrator**
7. Click **Add**

**Note:** It may take a few minutes for permissions to propagate.

---

## ⚙️ Step 4: Install Dependencies

```bash
npm install
```

This will install the `googleapis` package required for the setup script.

---

## 🚀 Step 5: Run Setup Script

```bash
npm run setup:ga4
```

The script will:
1. ✅ Connect to GA4 Management API
2. ✅ Create 15 custom dimensions (user-scoped 1-4, event-scoped 5-15)
3. ✅ Mark 5 events as conversions
4. ✅ Report on what was created vs. what already existed

### Expected Output

```
🚀 Starting GA4 Setup...

📡 Connecting to GA4 Management API...
✅ Connected to property: 123456789

📊 Property: Your Property Name
   Account: Your Account Name

📐 Setting up custom dimensions...
   ✅ user_segment (USER)
   ✅ device_category (USER)
   ✅ coffee_experience (USER)
   ✅ geographic_segment (USER)
   ✅ roaster_id (EVENT)
   ✅ coffee_id (EVENT)
   ... (more dimensions)

📐 Custom Dimensions: 15 created, 0 already exist

🎯 Setting up conversion events...
   ✅ roaster_conversion
   ✅ coffee_purchase_intent
   ✅ roaster_engagement
   ✅ coffee_discovered
   ✅ tools_engagement

🎯 Conversion Events: 5 created, 0 already exist

✨ Setup Complete!

📋 Summary:
   • Custom Dimensions: 15 configured
   • Conversion Events: 5 configured

💡 Next Steps:
   1. Verify setup in GA4 dashboard
   2. Create custom reports (see below)
   3. Delete setup files after verification
   4. Remove service account credentials from production env
```

---

## ✅ Step 6: Verify Setup

### 6.1 Verify Custom Dimensions

1. Go to GA4 > **Admin** > **Custom Definitions** > **Custom Dimensions**
2. You should see all 15 dimensions listed:
   - User-scoped: `user_segment`, `device_category`, `coffee_experience`, `geographic_segment`
   - Event-scoped: `roaster_id`, `coffee_id`, `content_series`, `tool_type`, `filter_combination`, `conversion_value`, `traffic_source_detail`, `session_depth`, `performance_grade`, `roaster_tier`, `purchase_intent`

### 6.2 Verify Conversion Events

1. Go to GA4 > **Admin** > **Events**
2. Look for these events marked as conversions:
   - ✅ `roaster_conversion`
   - ✅ `coffee_purchase_intent`
   - ✅ `roaster_engagement`
   - ✅ `coffee_discovered`
   - ✅ `tools_engagement`

---

## 📊 Step 7: Create Custom Reports (Manual)

Custom reports cannot be created via API, so you'll need to create them manually in the GA4 dashboard.

### Report 1: Roaster Partnership Analytics

1. Go to GA4 > **Reports** > **Library** > **Create Custom Report**
2. Select **Detail Report**
3. Configure:
   - **Report Name**: "Roaster Business Intelligence"
   - **Dimensions**: 
     - Primary: `roaster_id` (custom dimension 5)
     - Secondary: `traffic_source_detail` (custom dimension 11)
     - Breakdown: `device_category` (custom dimension 2)
   - **Metrics**: Sessions, Event count (roaster_conversion), Event count (roaster_engagement), Average session duration
   - **Filters**: Event name contains "roaster_"

### Report 2: Coffee Purchase Intent

1. Create another **Detail Report**
2. Configure:
   - **Report Name**: "Coffee Conversion Analytics"
   - **Dimensions**:
     - Primary: `coffee_id` (custom dimension 6)
     - Secondary: `roaster_id` (custom dimension 5)
     - Breakdown: `purchase_intent` (custom dimension 15)
   - **Metrics**: Event count (coffee_purchase_intent), Event count (coffee_discovered), Sessions
   - **Filters**: Event name contains "coffee_"

### Report 3: Platform Overview

1. Create another **Detail Report**
2. Configure:
   - **Report Name**: "Platform Business Metrics"
   - **Dimensions**:
     - Primary: `traffic_source_detail` (custom dimension 11)
     - Secondary: `device_category` (custom dimension 2)
     - Breakdown: `geographic_segment` (custom dimension 4)
   - **Metrics**: Active users, Sessions, Event count (conversion events), Average engagement time

---

## 🧹 Step 8: Cleanup (After Verification)

Once you've verified everything works:

### 8.1 Delete Setup Files

```bash
# Delete the setup script
rm scripts/setup-ga4.ts

# Delete the GA4 Management API client
rm src/lib/analytics/ga4-management.ts
```

### 8.2 Remove from Environment Variables

Remove these from your production environment variables (keep in `.env.local` for reference if needed):
- `GA4_PROPERTY_ID`
- `GOOGLE_SERVICE_ACCOUNT_KEY`
- `GOOGLE_CLOUD_PROJECT_ID`

### 8.3 Optional: Remove googleapis Dependency

If you're not using `googleapis` elsewhere, you can remove it:

```bash
npm uninstall googleapis
```

**Note:** Keep the documentation files in `ai_docs/` for future reference.

---

## 🔧 Troubleshooting

### Error: "GOOGLE_SERVICE_ACCOUNT_KEY is required"

**Solution:**
- Make sure you've set `GOOGLE_SERVICE_ACCOUNT_KEY` in `.env.local`
- If using file path, ensure the file exists and path is correct
- If using JSON string, ensure it's valid JSON

### Error: "Permission denied" or "403 Forbidden"

**Solution:**
1. Verify service account has **Analytics Admin** role in Google Cloud Console
2. Verify service account email is added to GA4 property with **Administrator** role
3. Wait a few minutes for permissions to propagate
4. Check that the service account key is valid and not expired

### Error: "Property not found"

**Solution:**
- Verify `GA4_PROPERTY_ID` is correct
- Use numeric property ID if G- format doesn't work
- Ensure the property exists and you have access

### Error: "Dimension already exists"

**Solution:**
- This is normal if you run the script multiple times
- The script will skip existing dimensions/events
- Check GA4 dashboard to verify they're configured correctly

### Custom Dimensions Not Showing in Reports

**Solution:**
- Custom dimensions only show data for events that occurred AFTER they were created
- Wait 24-48 hours for data to populate
- Verify events are being sent with the custom dimension parameters

---

## 📚 Additional Resources

- [GA4 Management API Documentation](https://developers.google.com/analytics/devguides/config/admin/v1)
- [GA4 Custom Dimensions Guide](https://support.google.com/analytics/answer/10075209)
- [GA4 Conversion Events Guide](https://support.google.com/analytics/answer/9267568)

---

## ✅ Success Checklist

- [ ] Service account created with Analytics Admin role
- [ ] Service account key downloaded and stored securely
- [ ] Service account added to GA4 property with Administrator role
- [ ] Environment variables configured in `.env.local`
- [ ] Setup script run successfully
- [ ] Custom dimensions verified in GA4 dashboard
- [ ] Conversion events verified in GA4 dashboard
- [ ] Custom reports created (manual step)
- [ ] Setup files deleted (after verification)
- [ ] Service account credentials removed from production env

---

**🎉 You're all set! Your GA4 property is now configured for advanced analytics tracking.**
