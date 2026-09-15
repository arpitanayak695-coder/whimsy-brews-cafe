# PRD — Whimsy Brews cafe website

## Product overview
A cinematic marketing website for a specialty coffee café: homepage with an interactive Three.js hero, full menu, specialty-coffee showcase, gallery, reviews, reservations, and a separate contact page — backed by a lightweight Flask API.

## Problem statement
The café has no online presence that reflects its premium, bean-forward positioning; visitors can't browse the menu, see the space, or reserve a table without calling in.

## Goals
- Communicate a premium, specialty-coffee brand identity in the first viewport.
- Let visitors browse the full menu and specialty offerings without leaving the page.
- Make reservations and inquiries frictionless, with clear validation and honest success/error states.
- Perform well and look intentional from 320px to 4K.

## Target audience
Specialty-coffee drinkers, remote workers looking for a café to work from, and locals deciding where to spend a weekend morning.

## Features
Sticky nav with mobile drawer · Three.js interactive hero · specialty-coffee carousel with detail modal · categorized menu · story/about section · gallery with lightbox · testimonial slider · location/hours · reservation form · standalone contact page and form · Flask backend.

## Functional requirements
- All interactive JS (tabs, lightbox, slider, forms, carousel, drawer) works without a build step, opened directly via `file://` or Live Server.
- Contact page is fully separate (`contact.html/.css/.js`) and is what `Contact` nav/footer links open — never an inline scroll target.
- Forms validate client-side (required fields, email format, date/guest bounds) before any network call, and never claim success when the backend call fails.

## Non-functional requirements
- No horizontal scroll at any width from 320px–3840px.
- `prefers-reduced-motion` respected across all GSAP/CSS animation.
- Keyboard operability for drawer, lightbox, modal (Escape to close, focusable controls).
- No secrets in frontend code; backend reads all credentials from environment variables.

## User journeys
1. Land on hero → tilt the cup with the cursor → "Explore Our Menu" scrolls to the menu.
2. Browse specialty coffee carousel → click a card → read origin/roast/notes in the modal.
3. Filter the menu by category → scan prices and descriptions.
4. Open the gallery → step through photos in the lightbox with arrow keys.
5. Read reviews on autoplay, or navigate manually.
6. Fill the reservation form on the homepage → receive a toast confirmation or a clear failure message.
7. Click `Contact` in the nav → land on `contact.html` → send an inquiry.

## Contact page requirements
Separate files; full Name, Mobile, Email, Message fields; validated; loading state on submit; honest success/failure messaging; same branding as the homepage.

## Reservation requirements
Name, Email, Date, Time, Guests (1–20), optional special request; client-side validation with inline error messages; loading spinner on submit; toast on completion.

## Technology stack
HTML5, CSS3, vanilla JS ES6+, Three.js, GSAP + ScrollTrigger, Flask (Python), SMTP (optional, env-configured).

## Acceptance criteria
See the Quality Checklist in the original project brief — all items are addressed in this build; responsive testing was done by breakpoint review in code (fluid `clamp()`-based spacing/typography plus explicit breakpoints at 1080 / 860 / 560px) rather than literal screenshots at all sixteen listed widths.
