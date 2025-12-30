# Slack App Setup Guide

This guide will help you set up Slack webhooks to receive notifications from Indian Coffee Beans.

## Option 1: Using Slack App Manifest (Recommended)

1. **Go to Slack API Dashboard**
   - Visit https://api.slack.com/apps
   - Click "Create New App"
   - Select "From an app manifest"

2. **Import the Manifest**
   - Choose your workspace
   - Copy and paste the contents of `slack-app-manifest.json`
   - Click "Next" and review the configuration
   - Click "Create"

3. **Enable Incoming Webhooks**
   - In your app settings, go to "Incoming Webhooks"
   - Toggle "Activate Incoming Webhooks" to ON

4. **Create Webhook for Activity Channel**
   - Click "Add New Webhook to Workspace"
   - Select the channel where you want signups and reviews (e.g., `#activity`, `#user-activity`)
   - Click "Allow"
   - Copy the webhook URL (starts with `https://hooks.slack.com/services/...`)
   - This is your `SLACK_WEBHOOK_URL_ACTIVITY`

5. **Create Webhook for Forms Channel**
   - Click "Add New Webhook to Workspace" again
   - Select the channel where you want contact forms (e.g., `#forms`, `#contact-forms`)
   - Click "Allow"
   - Copy the webhook URL
   - This is your `SLACK_WEBHOOK_URL_FORMS`

6. **Add to Environment Variables**
   ```env
   SLACK_WEBHOOK_URL_ACTIVITY=https://hooks.slack.com/services/YOUR/ACTIVITY/WEBHOOK
   SLACK_WEBHOOK_URL_FORMS=https://hooks.slack.com/services/YOUR/FORMS/WEBHOOK
   ```

## Option 2: Manual Setup

1. **Create a Slack App**
   - Go to https://api.slack.com/apps
   - Click "Create New App" → "From scratch"
   - Name: "Indian Coffee Beans Notifications"
   - Select your workspace
   - Click "Create App"

2. **Enable Incoming Webhooks**
   - In the left sidebar, click "Incoming Webhooks"
   - Toggle "Activate Incoming Webhooks" to ON

3. **Create Webhooks** (same as steps 4-5 above)

## Channel Recommendations

- **Activity Channel**: `#activity`, `#user-activity`, or `#notifications`
  - Receives: User signups, ratings/reviews
  
- **Forms Channel**: `#forms`, `#contact-forms`, or `#inquiries`
  - Receives: All contact form submissions

## Testing

After setting up, test the notifications:

1. **Test Signup Notification**
   - Create a new user account
   - Check the activity channel for the notification

2. **Test Review Notification**
   - Submit a rating/review
   - Check the activity channel for the notification

3. **Test Form Notification**
   - Submit a contact form
   - Check the forms channel for the notification

## Security Notes

- Keep your webhook URLs secret - they allow posting to your Slack channels
- Never commit webhook URLs to version control
- Use environment variables for all webhook URLs
- Consider rotating webhook URLs periodically

## Troubleshooting

**No notifications appearing?**
- Check that webhook URLs are correctly set in environment variables
- Verify the webhook URLs are active in Slack app settings
- Check server logs for any error messages
- Ensure the channels exist and the app has permission to post

**Notifications going to wrong channel?**
- Verify you're using the correct webhook URL for each notification type
- Check that the webhook was created for the correct channel

