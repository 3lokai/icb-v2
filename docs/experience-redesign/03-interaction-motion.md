# 03 — Interaction Grammar and Motion Choreography

## Visual behaviour
The site behaves like a sophisticated host: welcomes, senses intent, reveals the right level of detail, makes relevant introductions, never over-explains, steps aside when the visitor already knows what they want.

**Personality:** Graceful, lightly mysterious, responsive, restrained, confident, warm, intellectually stimulating, approachable. No literal human character needed.

## One environment, many functions
A coherent visual metaphor may evolve through the journey rather than resetting between sections. Candidate forms (not approved): physical textures/materials, evolving shapes, sensory relationships, origin geography, a moving visual field or typographic composition. The experience is not required to use a coffee bean as its central object.

## Motion categories
- **Expressive:** visual continuity, subtle depth, scene composition and storytelling, intentional 3D/camera movement.
- **Functional:** clear filter updates, focus/hover feedback, shared-element page transitions, search context preservation, progressive disclosure.

Every animation should do at least one of: evoke a feeling, explain a relationship, or clarify a state transition. Reject motion without purpose.

## What the storyboard must demonstrate
- A continuous 5–7 keyframe progression with clear before/after states and spatial continuity.
- Position and purpose of search and direct technical filters, including while the environment is expressive.
- A meaningful user-triggered state change beyond passive scrolling.
- Movement between guided discovery, technical discovery, coffee detail and adjacent editorial content.
- Persistent navigation, accessible reading order, focus, back behaviour and mobile equivalent.
- Timing/easing rationale, visual assets/3D asset ownership, interaction and scroll mechanics.

## An illustrative arc, *not an approved screen design*
Arrival with beautiful restrained composition → invitation to explore / search / specify expertise → a gentle question or technical selection → visual world reorganises to represent taste and coffee relationships → real results appear with tangible information → a coffee opens without breaking visual continuity → unexpected but relevant article/estate/process invites a further discovery.

Do not blindly generate this exact flow. Challenge it during storyboarding and demonstrate two distinctive ways to embody hospitality.

## Runtime constraints
- Mobile is an equal design target, not just a shrunken desktop WebGL scene.
- Smooth scrolling is optional, not an unconditional requirement. Avoid scroll hijack and main-thread lag.
- Respect `prefers-reduced-motion` and user control; provide useful static alternative and full keyboard navigation.
- Preserve content outside 3D canvas. A semantic DOM must contain actual copy and interactive controls.
- Maintain stable layout and fast content visibility. Use targeted animation rather than animating every element.
- 3D should run only where it materially changes the experience, loaded on demand and with graceful fallback.
- Storyboards in Penpot specify states and continuity; live browser experiments validate *feel* and feasibility.
