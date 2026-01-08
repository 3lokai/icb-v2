# ConvertKit Newsletter Email Template

This HTML email template is designed for ConvertKit newsletter emails and matches the editorial style of your homepage components.

## Features

- **Header Section**: Image and editorial text with overline, title, and description
- **3 Editorial Sections**: Following the same pattern as your homepage components:
  1. New Arrivals (Freshly Harvested)
  2. Featured Roasters (The Craftsmen)
  3. Educational Content (Knowledge Base)
- **Share the Coffee Love Section**: Includes shareable text and social media share buttons

## Design Pattern

Each editorial section follows your homepage pattern:
- Horizontal accent line + overline text (uppercase, tracking-wide)
- Title with accent italic text
- Description paragraph
- Content card with image and text

## Usage Instructions

### 1. Replace Image and Link Placeholders

Replace these placeholders in the template with actual values:

**Image URLs:**
- `{{HEADER_IMAGE_URL}}` - URL to your header image (recommended: 580px wide)
- `{{SECTION1_IMAGE_URL}}` - Image for New Arrivals section
- `{{SECTION2_IMAGE_URL}}` - Image for Featured Roasters section
- `{{SECTION3_IMAGE_URL}}` - Image for Educational Content section
- `{{LOGO_URL}}` - Your logo image URL (32x32px recommended)

**Link URLs:**
- `{{SECTION1_LINK_URL}}` - Link to coffees page (e.g., https://indiancoffeebeans.com/coffees)
- `{{SECTION2_LINK_URL}}` - Link to roasters page (e.g., https://indiancoffeebeans.com/roasters)
- `{{SECTION3_LINK_URL}}` - Link to learn/education page (e.g., https://indiancoffeebeans.com/learn)

**Note:** The site URL (https://indiancoffeebeans.com) is hardcoded in the template. Update it if your domain is different.

### 2. ConvertKit Integration

1. **Copy the template** from `newsletter-template.html`
2. **Paste into ConvertKit**:
   - Go to Broadcasts → Templates
   - Create a new template
   - Switch to HTML view
   - Paste the template
3. **Replace image placeholders** with actual hosted image URLs
4. **Test** the email in multiple email clients

### 3. ConvertKit Variables Used

The template uses these ConvertKit variables (already included):

**Subscriber Variables:**
- `{{ subscriber.first_name }}` - Subscriber's first name (used in greeting)
- `{{ subscriber.email_address }}` - Subscriber's email address

**Link Variables:**
- `{{ unsubscribe_link }}` - Unsubscribe link (full link with text)
- `{{ unsubscribe_url }}` - Unsubscribe URL (for custom link text)
- `{{ subscriber_preferences_link }}` - Update preferences link (full link)
- `{{ subscriber_preferences_url }}` - Update preferences URL (for custom text)

**Content Variables:**
- `{{ message_content }}` - Main broadcast content (insert where you want the message body)
- `{{ address }}` - Company address (from account settings, shown in footer if set)

**Note:** The template uses Liquid templating syntax (`{% if %}`) for conditionals. ConvertKit supports this syntax.

### 4. Image Requirements

- **Header Image**: 580px wide, any height (recommended: 300-400px)
- **Section Images**: 280px wide for side-by-side layouts, 580px for full-width
- **Logo**: 32x32px PNG or JPG
- **Format**: PNG or JPG (SVG not recommended for emails)
- **Hosting**: Images must be hosted on a public URL (CDN, Supabase Storage, etc.)

### 5. Customization

#### Update Section Content
Edit the text within each editorial section:
- Overline text (e.g., "Freshly Harvested")
- Title text
- Description paragraphs
- Card content

#### Change Colors
The template uses these colors (matching your design system):
- Accent: `#D97706` (warm orange/amber)
- Text: `#2d2d2d` (dark gray)
- Muted Text: `#6b6b6b` (medium gray)
- Background: `#fafaf9` (warm off-white)
- Card Background: `#ffffff` (white)

#### Social Share Buttons
The share buttons include:
- Twitter/X
- Facebook
- LinkedIn
- WhatsApp

You can add/remove social platforms by editing the button table in the "Share the Coffee Love" section.

### 6. Testing Checklist

Before sending:
- [ ] All images load correctly
- [ ] All links work
- [ ] Template renders correctly in:
  - Gmail (desktop and mobile)
  - Outlook (desktop)
  - Apple Mail
  - Mobile email clients
- [ ] Social share buttons work
- [ ] Unsubscribe link works
- [ ] Text is readable on mobile devices

### 7. Responsive Design

The template includes responsive breakpoints:
- Desktop: Full-width layout with side-by-side content
- Mobile: Stacked layout with adjusted padding and font sizes

Media queries handle:
- Padding adjustments
- Font size scaling
- Column stacking
- Image sizing

## Template Structure

```
Header Section
├── Header Image
└── Editorial Text (overline + title + description)

Editorial Section 1 (New Arrivals)
├── Editorial Header
└── Content Card (image + text)

Editorial Section 2 (Featured Roasters)
├── Editorial Header
└── Content Card (text + image)

Editorial Section 3 (Educational Content)
├── Editorial Header
└── Content Card (full-width image + text)

Share the Coffee Love Section
├── Shareable Text Box
├── Social Share Buttons
└── Copy Link Section

Footer
├── Logo/Brand
├── Description
├── Links (Visit Website | Unsubscribe)
└── Copyright
```

## Notes

- The template uses table-based layouts for maximum email client compatibility
- Inline styles are used throughout (email clients don't support external CSS well)
- Web fonts (Playfair Display, DM Sans) are included but may not render in all clients
- System font fallbacks ensure compatibility
- All colors are converted from oklch to hex for email compatibility

## ConvertKit Variables Reference

The template uses these ConvertKit variables:

| Variable | Description | Usage in Template |
|----------|-------------|-------------------|
| `{{ subscriber.first_name }}` | Subscriber's first name | Header greeting |
| `{{ subscriber.email_address }}` | Subscriber's email | Available but not used |
| `{{ unsubscribe_link }}` | Full unsubscribe link | Footer (alternative) |
| `{{ unsubscribe_url }}` | Unsubscribe URL only | Footer link |
| `{{ subscriber_preferences_url }}` | Preferences URL | Footer link |
| `{{ message_content }}` | Broadcast message body | Not inserted (add manually) |
| `{{ address }}` | Company address | Footer (conditional) |

**Liquid Syntax:** The template uses `{% if %}` conditionals for:
- Greeting (shows name if available)
- Address (shows if set in account settings)

## Support

For ConvertKit-specific questions, refer to their documentation:
- [ConvertKit Email Templates](https://help.convertkit.com/en/articles/2502591-email-templates)
- [ConvertKit Variables](https://help.convertkit.com/en/articles/2502601-email-tags)

