# Whimsy Brews & Café — Website

A cinematic, fully responsive specialty-coffee café website: an interactive Three.js/GSAP homepage plus a separate contact page, with a small Flask backend for the contact and reservation forms.

## Features
- Sticky glass navbar with active-link highlighting and a mobile drawer (Escape / outside-click / close button all work).
- Interactive Three.js hero — cursor-tilted coffee cup and floating beans over an ambient looping background video.
- Horizontal specialty-coffee carousel with an origin/roast/notes detail modal.
- Tabbed menu (Coffee / Artisanal Drinks / Pastries / Main Course).
- Gallery with keyboard- and swipe-friendly lightbox.
- Auto-playing, swipeable testimonial slider.
- Validated reservation form (homepage) and a fully separate, validated contact page.
- Flask API skeleton for `/api/contact` and `/api/reservation`, with optional SMTP email delivery.

## Tech stack
HTML5 · CSS3 (custom properties, Grid/Flexbox, `clamp()`) · vanilla JS ES6+ · Three.js r128 · GSAP 3.12 + ScrollTrigger · Flask 3 (Python).

## Folder structure
```
coffee-cafe-website/
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── main.js
│   ├── contact.html
│   ├── contact.css
│   ├── contact.js
│   ├── assets/
│   │   ├── interior/
│   │   ├── speciality-coffee/
│   │   ├── stories-section/
│   │   ├── coffee-beans.png
│   │   ├── coffee-beans-1.png
│   │   └── coffee-cup.png
│   └── README.md
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   ├── .env.example
│   └── .gitignore
├── design.md
├── memory.md
├── phases.md
├── PRD.md
├── rules.md
└── README.md
```

## Run the frontend
No build step required.

**Option A — open directly**
Double-click `frontend/index.html` (or `contact.html`). Everything works from `file://`, including navigation between the two pages.

**Option B — VS Code Live Server**
Right-click `frontend/index.html` → "Open with Live Server".

## Run the backend
```bash
cd backend
pip install -r requirements.txt --break-system-packages
cp .env.example .env      # then fill in SMTP details if you want real email delivery
python server.py
```
The API starts on `http://localhost:5000` by default (`PORT` in `.env`).

To connect the frontend to a non-default API location, set `window.WHIMSY_BREWS_API_BASE` in a small inline `<script>` before `main.js`(on index.html)/`contact.js`(on contact.html) load, e.g.:
```html
<script>window.WHIMSY_BREWS_API_BASE = "[http://127.0.0.1:5000](http://127.0.0.1:5000)";</script>
```

## API endpoints
| Method | Path | Body | Notes |
|---|---|---|---|
| GET | `/api/health` | — | Health check |
| POST | `/api/contact` | `{ name, phone, email, message }` | Validated server-side; returns `emailed:false` honestly if SMTP isn't configured |
| POST | `/api/reservation` | `{ name, email, date, time, guests, request }` | Same validation/email behavior |

## Environment setup
Copy `backend/.env.example` to `backend/.env`. Leave `SMTP_*` blank to run without real email delivery — the API still accepts and logs submissions and reports that honestly to the frontend.

## Troubleshooting
- **Videos/images don't load when opened via `file://`**: some browsers restrict local video playback under strict CORS/file policies — use Live Server (Option B) if this happens.
- **Reservation/contact form shows a "couldn't reach the service" toast**: Ensure the Flask backend is running. Check that 'WHIMSY_BREWS_API_BASE' matches the backend URL. If running locally via Live Server, ensure you have created the backend/.env file and set ALLOWED_ORIGINS="*" or your specific Live Server port to avoid CORS errors.
- **Fonts look different than expected**: Google Fonts requires an internet connection on first load; the site falls back to system serif/sans-serif otherwise.

## Browser compatibility
Tested against current Chrome, Edge, and Firefox rendering behavior (Grid, `clamp()`, WebGL, `backdrop-filter`). Safari is supported for all core layout/JS; `backdrop-filter` blur on the sticky nav degrades gracefully to a solid background on browsers without support.

## Developer credit
Developed by Arpita Nayak [Suusri AI]
