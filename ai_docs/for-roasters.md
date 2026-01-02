# Partner Page Brief - `/roasters/partner`

## Project Context
Building a dedicated landing page for roasters to learn about listing on IndianCoffeeBeans.com and sign up for paid verification tiers. This page is critical for monetization and converting roaster inquiries into paying customers.

## Page URL
`/roasters/partner` or `/roasters/get-listed` (pick one, I prefer `/roasters/partner`)

## Design System
- **Magazine layout aesthetic** - Clean borders, subtle dot patterns, no glassmorphism
- Use existing design tokens from `globals.css` and modular CSS files
- Surface layers: `.surface-0`, `.surface-1`, `.surface-2` (not blur-based)
- Card styles: `.card-base`, `.card-hover`, `.card-shell`
- Typography: `.text-hero`, `.text-display`, `.text-heading`, `.text-body`, etc.
- Layout: `.container-default`, `.section-spacing`, `.stack-md`, `.grid-cards`
- OKLCH color system with coffee-tinted shadows
- Subtle dot pattern backgrounds on cards
- Accent color bars on featured elements
- Mobile-first responsive design
- Dark mode support via `.dark` variant

## Page Structure

### 1. Hero Section
**Layout:** Full-width section with centered content

**Content:**
```
[Small badge] FOUNDING ROASTERS WANTED

[Large heading] Be Among the First.
               Grow With Us.

[Subheading] We're building India's most comprehensive coffee 
platform. Join as a founding roaster and help shape 
the future of Indian specialty coffee discovery.

[Primary CTA Button] Get Listed Free
[Secondary CTA Button] See Pricing
```

**Design Notes:**
- Badge: Use `.badge` utility with `.text-overline` or `.text-label`
- Heading: Use `.text-display` or `.text-hero` typography class
- Subheading: `.text-body-large` or `.text-body-muted`, max-width 600px, centered
- CTAs: Use `<Button>` component with size="lg"
- Background: Subtle gradient or pattern
- Add subtle dot pattern overlay (see ContactForms reference)

---

### 2. Stats Bar
**Layout:** 4-column grid (responsive: 2x2 on mobile)

**Content:**
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ 60+         │ 2,000+        │ 10          │ 0%          │
│ Roasters    │ Coffees     │ Founding    │ Commission  │
│ Listed      │ Cataloged   │ Spots Left  │             │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

**Design Notes:**
- Use `.grid-cards` as base or custom grid
- Each stat card: `.card-shell` or `.card-base` with `.card-hover`
- Large number: 3xl or 4xl font size, primary or accent color
- Label: `.text-caption` or `.text-label`, muted-foreground color
- Add subtle animation on scroll (`.card-fade-in`)
- Consider adding subtle dot pattern background (see ContactForms InteractiveBentoCard)

---

### 3. Benefits Section
**Layout:** 3-column grid (1 column on mobile)

**Heading:** Why Partner With Us?

**Content (3 cards - Use InteractiveBentoCard pattern from ContactForms.tsx):**

**Card 1:**
```
🚀 Early Mover Advantage
Be featured when coffee enthusiasts discover the platform. 
Get visibility before competition floods in.
```

**Card 2:**
```
📈 Growing Fast
60+ roasters, 2,000+ coffees, and momentum building daily. 
Real data, real roasters, real impact.
```

**Card 3:**
```
🤝 Shape the Platform
Direct input on features. Your feedback drives our roadmap. 
We build what roasters actually need.
```

**Design Notes:**
- Use the InteractiveBentoCard component pattern from ContactForms.tsx
- Icon in rounded square with accent background (`.bg-accent/10 .text-accent`)
- Card structure: border, bg-card, shadow-sm, hover:shadow-md
- Subtle dot pattern overlay (see ContactForms line 56-64)
- Left accent bar on hover (`.bg-linear-to-b from-primary/40 via-accent/40`)
- Transform animation on hover (group-hover:-translate-y-2)
- Arrow icon that shifts right on hover
- Padding: p-6 md:p-8

---

### 4. How It Works
**Layout:** Horizontal timeline or numbered steps

**Heading:** Get Listed in 3 Steps

**Content:**
```
1. Submit Your Details
   Fill out a quick form with your roastery info, 
   website, and contact details.

2. Choose Your Tier
   Start free or upgrade to Verified/Premium for 
   enhanced features and analytics.

3. Go Live
   Your profile goes live within 24-48 hours. 
   Start getting discovered.
```

**Design Notes:**
- Large numbers in primary or accent color
- Step cards: use `.card-shell` or `.card-base` with subtle border
- Add connecting lines between steps (optional, subtle)
- Use `.stack-md` for vertical spacing
- Mobile: Stack vertically with full width

---

### 5. Pricing Tiers
**Layout:** 3-column pricing cards (stack on mobile)

**Heading:** Choose Your Plan

#### Free Tier
```
FREE
₹0 / Forever

✓ Basic listing
✓ Link to your website
✓ Community reviews visible
✓ Searchable in directory

[Button] Get Started
```

#### Verified Tier (Highlight this one - Featured Card)
```
VERIFIED
₹2,500 / year
[Badge] First 10 Only - Then ₹6,000

✓ Everything in Free
✓ Verified badge
✓ Claim & edit your profile
✓ Add roastery story & photos
✓ Product management dashboard
✓ Traffic analytics
✓ Priority support
✓ Price locked forever
✓ "Founding Roaster" badge
✓ Featured in launch posts

[Button] Claim Founding Spot
```

#### Premium Tier
```
PREMIUM
₹15,000 / year
[Badge] Limited Availability

✓ Everything in Verified
✓ Advanced analytics dashboard
✓ Competitor benchmarking
✓ Unlimited photos/videos
✓ Custom profile sections
✓ Email capture widget
✓ Quarterly optimization reviews
✓ Early access to new features
✓ Data cleanup service (coming soon)

[Button] Contact Us
```

**Design Notes:**
- Middle card (Verified) should be emphasized:
  - Use `.card-featured` class with 2px border-primary
  - Or add vertical accent bar like in ContactForms roaster section (line 266)
  - Slightly larger scale or elevated shadow
  - Transform scale on hover
- All cards: Use `.card-shell` or `.card-base` with `.card-hover`
- Badge: Use `.badge` utility for special offers
- Checkmarks: Use Icon component with CheckCircle (see ContactForms line 315)
- Use `<Button>` component with size="lg"
- Price: Large, bold, accent color
- Mobile: Stack cards with Verified tier appearing first/top

---

### 6. What You Get Section
**Layout:** 2-column feature grid (1 column mobile)

**Heading:** What's Included

**Features (Grid of 6-8 items):**
```
📊 Traffic Analytics
See who's viewing, clicking, and discovering your coffees.

✅ Verified Badge
Build trust with a platform-verified checkmark.

🎯 Direct Traffic
We drive coffee lovers to YOUR website. Zero commission.

📸 Rich Profiles
Upload photos, tell your story, showcase your process.

⭐ Community Reviews
Let customers share their experiences with your beans.

🔧 Product Management
Add, edit, and organize your coffee listings easily.

📈 Performance Insights
Understand what coffees resonate with your audience.

🤝 Priority Support
Get help when you need it via email/WhatsApp.
```

**Design Notes:**
- Icon + Heading + Description per card
- 2-column grid on desktop (`grid grid-cols-1 md:grid-cols-2`)
- Use `.card-base` or simplified card with border and padding
- Icon: Use Icon component with size={24}, accent color
- Heading: `.text-subheading` or `.text-heading`
- Description: `.text-caption` or `.text-body-muted`
- Hover effect: subtle border color change or scale
- Consistent p-6 md:p-8 padding

---

### 7. FAQ Section
**Layout:** Accordion component

**Heading:** Frequently Asked Questions

**Questions:**
```
Q: Do you take commission on sales?
A: No. We drive traffic to your website. You keep 100% of sales.

Q: How do I track performance?
A: Verified roasters get a dashboard with views, clicks, and engagement metrics.

Q: Can I manage my own listings?
A: Yes. Verified tier gives you full control to add/edit coffees and profile info.

Q: What's the "Founding Roaster" benefit?
A: Lock in ₹2,500/year pricing forever (regular ₹6,000). Plus exclusive badge and launch features.

Q: How long does verification take?
A: 24-48 hours after payment. We verify ownership via email/domain check.

Q: Can I cancel anytime?
A: Yes, but no refunds after 7 days. Annual subscription, cancellation applies to next year.

Q: What payment methods do you accept?
A: We use Instamojo - accepts UPI, cards, net banking, wallets.

Q: Is GST included in pricing?
A: Prices shown are final. We're currently not GST registered.
```

**Design Notes:**
- Use Accordion component from shadcn/ui or build custom with Radix
- Accordion items: `.card-shell` or similar with border
- Smooth expand/collapse animation (see effects.css accordion animations)
- Icon to indicate open/closed state (ChevronDown icon)
- Question: `.text-subheading` or bold
- Answer: `.text-body` or `.text-body-muted`

---

### 8. Social Proof (Optional - Add later when you have roaster testimonials)
**Layout:** Carousel or grid

**Heading:** Success Stories

**Content:** 
```
[Roaster Logo]
"Quote from roaster about their experience"
- Name, Roastery Name
```

**Design Notes:**
- Use `.testimonial-card` utility
- Carousel with navigation arrows
- 3 testimonials per view on desktop

---

### 9. Final CTA Section
**Layout:** Centered, full-width section (similar to ContactForms roaster feature card)

**Content:**
```
[Heading] Ready to Get Discovered?

[Subheading] Join 60+ roasters already listed on India's 
fastest-growing coffee platform.

[Primary CTA] Claim Your Founding Spot
[Secondary CTA] Start with Free Listing

[Small text] Questions? Email us at contact@indiancoffeebeans.com
```

**Design Notes:**
- Consider magazine-style feature card (see ContactForms roaster section line 261-342)
- Large rounded border (rounded-3xl)
- Vertical accent bar on left (`.bg-linear-to-b from-primary via-accent`)
- Dot pattern overlay for texture
- Optional: Split layout with image on one side (like ContactForms roaster card)
- Large, prominent CTAs with `<Button size="lg">`
- High visual impact section - this is the conversion point
- Use `.section-spacing` for vertical rhythm

---

## Forms & CTAs

### Primary CTA Destinations:
- "Get Listed Free" → Simple contact form or direct to email
- "Claim Founding Spot" → Founding roaster contact form
- "See Pricing" → Scroll to pricing section (smooth scroll)

### Contact Form Fields:
```
- Roastery Name* (required)
- Your Name* (required)
- Email* (required)
- Phone Number
- Website URL
- Interested in: [Dropdown: Free / Verified / Premium]
- Message (optional)
- [Checkbox] I agree to Terms of Service

[Submit Button] Submit Request
```

**Form Handling:**
- For now, simple email submission (can use Formspree, Basin, or custom API route)
- Send to: contact@indiancoffeebeans.com
- Success message: "Thanks! We'll reach out within 24 hours."
- Error handling with validation

---

## Technical Requirements

### SEO
```html
<title>Partner With Us - List Your Roastery | IndianCoffeeBeans</title>
<meta name="description" content="Join 45+ roasters on India's premier coffee platform. Get discovered by coffee enthusiasts. Founding roaster pricing: ₹2,500/year (limited spots).">
<meta property="og:title" content="Partner With Us - IndianCoffeeBeans">
<meta property="og:description" content="List your roastery on India's fastest-growing coffee platform">
<meta property="og:image" content="/og-partner.jpg">
```

### Accessibility
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text for all images/icons
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus states visible
- Color contrast WCAG AA compliant

### Performance
- Lazy load images below fold
- Optimize hero section images
- Use Next.js Image component
- Minimal JavaScript (mostly static)
- No large third-party scripts

### Analytics Events to Track
```javascript
// Track button clicks
onClick={() => trackEvent('partner_cta_clicked', { tier: 'verified' })}

// Track form submissions
onSubmit={() => trackEvent('partner_form_submitted', { tier: selectedTier })}

// Track scroll to pricing
onPricingView={() => trackEvent('pricing_section_viewed')}
```

---

## Component Structure

```
/app/roasters/partner/page.tsx  (Server component with metadata)
/app/roasters/partner/PartnerPageClient.tsx  (Client component for interactivity)

PartnerPageClient components:
├── PageHeader (import from @/components/layout/PageHeader - see contact page)
│   └── Title + Description
├── HeroSection (optional if PageHeader covers it)
├── StatsBar
├── BenefitsSection
│   └── InteractiveBentoCard (x3) - pattern from ContactForms.tsx
├── HowItWorksSection
├── PricingTiers
│   ├── PricingCard (x3)
│   └── ComparisonTable (optional)
├── FeaturesGrid
├── FAQAccordion
├── SocialProof (coming later)
└── FinalCTA
```

**Reference Components:**
- See `ContactForms.tsx` for InteractiveBentoCard pattern (lines 30-96)
- See `ContactForms.tsx` for magazine-style feature card (lines 261-342)
- Import `PageHeader` from `@/components/layout/PageHeader`
- Import `Section` and `Stack` primitives from respective components
- Import `Button` from `@/components/ui/button`
- Import `Icon` from `@/components/common/Icon`

---

## Copy Tone & Voice
- **Conversational but professional**
- **No pretentious coffee jargon**
- **Direct benefits, not vague features**
- **"You" language, not "we/us" focused**
- **Emphasize partnership, not transaction**
- **Urgency without sleaze** ("Limited spots" not "Act now!!")

Examples:
✅ "Get discovered by serious coffee drinkers"
❌ "Leverage our platform to maximize your digital footprint"

✅ "We drive traffic to your website. You keep 100%."
❌ "Our commission-free model ensures optimal revenue retention"

---

## Mobile Considerations
- Stack all multi-column layouts
- Pricing cards: Show Verified first on mobile
- Touch-friendly button sizes (min 44px)
- Hamburger menu if needed
- Fixed CTA button at bottom (optional)

---

## Dark Mode
- All sections should support `.dark` class
- Test glassmorphism opacity in dark mode
- Ensure text contrast in both themes
- Icons/illustrations should adapt

---

## Assets Needed
- Hero background image/gradient (optional)
- Roaster logos for social proof (later)
- Icons for features (use Lucide React or emoji)
- OG image for social sharing

---

## Future Enhancements (Not MVP)
- [ ] Live chat widget for roaster questions
- [ ] Video testimonials from roasters
- [ ] Interactive pricing calculator
- [ ] Roaster success metrics dashboard preview
- [ ] Integration showcase (Shopify/WooCommerce)
- [ ] Case studies page

---

## Success Metrics
After launch, track:
- Page views
- Form submissions
- Tier selection (Free vs Verified vs Premium interest)
- Scroll depth (do people read full page?)
- Time on page
- CTA click-through rates

---

## Timeline
- Design/Build: 4-6 hours
- Content review: 1 hour
- Testing: 1 hour
- **Target: Ship within 1 day**

---

## Related Pages to Link
- `/roasters` - Main roasters directory
- `/about` - About IndianCoffeeBeans
- `/contact` - General contact page
- `/terms` - Terms of service (mention in form)
- `/privacy` - Privacy policy

---

## Questions/Decisions Needed
1. Exact URL: `/roasters/partner` vs `/roasters/get-listed`?
2. Contact form vs direct email vs Calendly booking?
3. Show pricing immediately or behind "Request Info"?
4. Add comparison table (Free vs Verified vs Premium)?
5. Include video explainer or keep text-only?

**Recommendation:** Keep it simple for MVP. You can always add complexity later.

---

## Final Notes
- This is a sales page, not a product page
- Focus: Convert roaster inquiries → paying customers
- Every section should answer: "What's in it for me?"
- Remove friction from signup process
- Make founding roaster offer time-sensitive (10 spots)

**Ship this page BEFORE doing roaster outreach emails.**

---

## Example Roaster Outreach Email (For Context)
After this page is live, send:

```
Subject: Founding Roaster Invite - IndianCoffeeBeans.com

Hi [Roaster Name],

We've listed [Roastery] on IndianCoffeeBeans.com, India's first 
specialty coffee directory (just launched).

You're already getting profile views from coffee enthusiasts. 
See your listing: [link]

Want to claim your profile? We're offering founding roaster 
benefits (verified badge + locked-in pricing) for the first 
10 roasters: [link to /roasters/partner]

Cheers,
GT
IndianCoffeeBeans.com
```

---

## Design Inspiration
- Find.coffee structure (hero, stats, pricing, FAQ)
- Your existing homepage aesthetic (glassmorphism, OKLCH colors)
- Stripe's pricing page clarity
- Linear's product page minimalism

**Do NOT copy Find.coffee's beige theme or exact copy.**

---

## Handoff Checklist
- [ ] All content finalized above
- [ ] Design system tokens documented (in globals.css)
- [ ] Component structure defined
- [ ] SEO metadata specified
- [ ] Analytics events listed
- [ ] Mobile breakpoints considered
- [ ] Dark mode support required
- [ ] Form submission endpoint determined
- [ ] Success/error states defined

**This brief should be comprehensive enough for Cursor + agents to build autonomously.**

Let me know if you need any clarifications before handing this off!