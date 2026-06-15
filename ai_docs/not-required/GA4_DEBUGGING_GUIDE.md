# 🔍 GA4 Data Not Showing - Debugging Guide

If you've set up GA4 but aren't seeing data, follow this troubleshooting checklist.

---

## ✅ Quick Checks

### 1. **Verify Environment Variable is Set**

Check that `NEXT_PUBLIC_GA_ID` is set in your `.env.local`:

```bash
# Should match your GA4 Measurement ID (format: G-XXXXXXXXXX)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Important:** 
- This is different from `GA4_PROPERTY_ID` (used for setup script)
- `NEXT_PUBLIC_GA_ID` is the **Measurement ID** (starts with `G-`)
- You can find it in GA4: **Admin** > **Data Streams** > Select your stream > **Measurement ID**

### 2. **Check if You're Testing on Localhost**

The tracking code **only works in production** (not on localhost). This is by design for privacy.

**To test locally:**
- Deploy to production/staging first
- OR temporarily modify `isProduction()` check (not recommended for production)

### 3. **Verify Cookie Consent is Granted**

GA4 tracking requires user consent. Check:

1. Open your website
2. Accept cookies/analytics consent
3. Check browser console for: `GA4 tracking disabled (dev environment)` - this means it's working but in dev mode
4. Check localStorage: `localStorage.getItem('icb-cookie-consent')` should return a JSON object with `analytics: true`

### 4. **Check Browser Console**

Open browser DevTools (F12) and check:

**Console Tab:**
- Look for errors related to `gtag` or `analytics`
- Should see: `GA4 tracking disabled (dev environment)` if on localhost
- Should NOT see errors about missing `NEXT_PUBLIC_GA_ID`

**Network Tab:**
- Filter by "collect" or "google-analytics"
- You should see requests to `https://www.google-analytics.com/g/collect` when events fire
- If you don't see these requests, tracking isn't working

### 5. **Verify GA4 Real-Time Reports**

GA4 has a delay for standard reports (24-48 hours), but **Real-Time** should show data immediately:

1. Go to GA4 dashboard
2. Navigate to **Reports** > **Real-time**
3. Visit your website (with consent granted)
4. You should see yourself appear in real-time within 30 seconds

**If Real-Time shows data but standard reports don't:**
- This is normal! Standard reports have a 24-48 hour delay
- Your setup is working correctly

---

## 🔧 Common Issues & Solutions

### Issue 1: "GA4 tracking disabled (dev environment)"

**Cause:** You're testing on localhost or the code detects you're in development mode.

**Solution:**
- Deploy to production/staging to test
- The tracking is intentionally disabled in development for privacy

### Issue 2: No data in Real-Time reports

**Possible causes:**
1. **Consent not granted** - User must accept analytics cookies
2. **Wrong Measurement ID** - `NEXT_PUBLIC_GA_ID` doesn't match your GA4 property
3. **Ad blocker** - Browser extensions blocking analytics
4. **Not in production** - Tracking disabled on localhost

**Debug steps:**
1. Check browser console for errors
2. Verify `NEXT_PUBLIC_GA_ID` in `.env.local` matches GA4 Measurement ID
3. Check Network tab for requests to `google-analytics.com/g/collect`
4. Try in incognito mode (disables most ad blockers)
5. Deploy to production and test there

### Issue 3: Data appears in Real-Time but not in standard reports

**Cause:** This is normal! Standard reports have a 24-48 hour processing delay.

**Solution:** Wait 24-48 hours. If Real-Time works, your setup is correct.

### Issue 4: Events not showing custom dimensions

**Cause:** Custom dimensions only show data for events that occurred AFTER they were created.

**Solution:**
- Wait for new events to fire (after custom dimensions were created)
- Custom dimensions won't have historical data
- Check Real-Time reports to see if new events include dimensions

---

## 🧪 Testing Checklist

### Step 1: Verify Setup
- [ ] `NEXT_PUBLIC_GA_ID` is set in `.env.local`
- [ ] `NEXT_PUBLIC_GA_ID` matches your GA4 Measurement ID (G-XXXXXXXXXX format)
- [ ] Website is deployed to production (not localhost)
- [ ] Cookie consent has been granted

### Step 2: Test Tracking
- [ ] Open website in production
- [ ] Accept cookie consent
- [ ] Open browser DevTools (F12)
- [ ] Check Console for errors
- [ ] Check Network tab for requests to `google-analytics.com/g/collect`
- [ ] Navigate to different pages
- [ ] Click on coffee cards, roaster cards, etc.

### Step 3: Verify in GA4
- [ ] Go to GA4 dashboard
- [ ] Navigate to **Reports** > **Real-time**
- [ ] Visit your website
- [ ] See yourself appear in Real-time report within 30 seconds
- [ ] Check that page views are being tracked

### Step 4: Test Custom Events
- [ ] Click on a coffee card (should fire `coffee_discovered`)
- [ ] Click on a roaster card (should fire `roaster_engagement`)
- [ ] Click "Buy Now" button (should fire `coffee_purchase_intent`)
- [ ] Click roaster website link (should fire `roaster_conversion`)
- [ ] Check Real-time events in GA4 to see these events

---

## 🐛 Debug Mode (Temporary)

If you need to test on localhost, you can temporarily modify the production check:

**⚠️ WARNING: Only do this for testing, revert before deploying!**

In `src/lib/analytics/index.ts`, temporarily change:

```typescript
const isProduction = (): boolean => {
  // TEMPORARY: Allow localhost for testing
  return true; // Always return true for testing
  
  // Original code (restore after testing):
  // return (
  //   process.env.NODE_ENV === "production" &&
  //   typeof window !== "undefined" &&
  //   !window.location.hostname.includes("localhost") &&
  //   !window.location.hostname.includes("127.0.0.1") &&
  //   !window.location.hostname.includes("3000")
  // );
};
```

**Remember to revert this after testing!**

---

## 📊 Verify Custom Dimensions Are Working

1. Go to GA4 > **Reports** > **Real-time**
2. Click on an event (like `coffee_discovered`)
3. Look for custom dimension parameters in the event details
4. You should see: `roaster_id`, `coffee_id`, `device_category`, etc.

**Note:** Custom dimensions only show data for events that occurred AFTER they were created. Historical events won't have dimension data.

---

## 🆘 Still Not Working?

If you've checked everything above and still don't see data:

1. **Check GA4 Property Settings:**
   - Go to **Admin** > **Property Settings**
   - Verify the property is active
   - Check that data collection is enabled

2. **Verify Measurement ID:**
   - Go to **Admin** > **Data Streams**
   - Click on your web stream
   - Copy the **Measurement ID** (G-XXXXXXXXXX)
   - Ensure it matches `NEXT_PUBLIC_GA_ID` exactly

3. **Check Browser Extensions:**
   - Disable ad blockers
   - Try incognito mode
   - Try a different browser

4. **Check Network Requests:**
   - Open DevTools > Network tab
   - Filter by "collect" or "analytics"
   - Visit your website
   - You should see POST requests to `https://www.google-analytics.com/g/collect`
   - If you don't see these, tracking isn't initializing

5. **Verify Consent:**
   - Open browser console
   - Run: `localStorage.getItem('icb-cookie-consent')`
   - Should return JSON with `analytics: true`
   - If not, accept cookies again

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Real-Time report shows your visits
2. ✅ Network tab shows requests to `google-analytics.com/g/collect`
3. ✅ Events appear in Real-Time events list
4. ✅ Custom dimensions show in event details (for new events)
5. ✅ No errors in browser console related to analytics

---

## 📝 Quick Reference

**Measurement ID vs Property ID:**
- **Measurement ID** (`NEXT_PUBLIC_GA_ID`): Used in tracking code, format `G-XXXXXXXXXX`
- **Property ID** (`GA4_PROPERTY_ID`): Used for Management API, numeric format

**Where to find:**
- Measurement ID: GA4 > Admin > Data Streams > Your Stream > Measurement ID
- Property ID: GA4 > Admin > Property Settings > Property ID

**Timeline:**
- Real-Time reports: Immediate (within 30 seconds)
- Standard reports: 24-48 hour delay
- Custom dimensions: Only for events after creation

---

**Need more help?** Check the browser console and Network tab - they'll tell you exactly what's happening!
