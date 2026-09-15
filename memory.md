# Project Memory — Whimsy Brews cafe

## Overview
A single specialty-café marketing site: cinematic Three.js/GSAP homepage (`index.html`) plus a fully separate `contact.html`, backed by a small Flask API skeleton for the contact and reservation forms.

## Key decisions
- **Reference image**: analyzed and followed for palette, hero composition, eyebrow/serif typography, horizontal coffee carousel, split about/stats layout, and testimonial card style. Copy, brand name and all imagery are original to this project.
- **Asset filenames**: the brief's asset list used spaces (`background video.mp4`); files were renamed to hyphenated, URL-safe names (`background-video.mp4`, etc.) inside `frontend/assets/` for reliability across servers and OSes. All `<video>`/`<img>` paths in the code use these exact renamed files — nothing is a placeholder.
- **Contact separation**: `contact.html`/`.css`/`.js` are fully standalone files, never merged into `index.html` or its assets. The homepage "Visit the Café" section intentionally omits a message form (only address/hours/map + a CTA to `contact.html`) so it can't be mistaken for the required standalone contact page.
- **Reservation vs contact**: kept as two distinct forms — reservation lives on the homepage (`#reserve`), general inquiries live on the contact page — matching the brief's separate functional requirements.
- **Three.js interaction**: intentionally capped rotation (`±0.14` rad range) so the cup tilts/parallaxes with the cursor but never behaves like a 360° product viewer, per the brief's explicit restriction.
- **Backend honesty**: `server.py` only reports `emailed: true` when SMTP actually succeeds; otherwise it returns `emailed: false` with a clear message, and the frontend surfaces that instead of a false "sent" confirmation.

## File structure
See root `README.md` for the full tree.

## Technology stack
HTML5, CSS3 (custom properties, Grid/Flexbox, `clamp()`), vanilla ES6+ JS, Three.js r128 (CDN), GSAP 3.12 + ScrollTrigger (CDN), Flask 3 backend.

## Future development notes
- Wire `window.WHIMSY_BREWS_API_BASE` (set before `main.js`/`contact.js` load) to point at a deployed backend URL.
- Swap the Google Maps `iframe` `src` for the café's real address once available.
- Consider image compression/`srcset` for the interior/specialty JPEGs before production deploy — current files are camera-resolution originals.
