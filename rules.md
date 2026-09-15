# Project Rules

## Coding rules
- Vanilla JS only on the frontend — no framework, no bundler required to run the site.
- One responsibility per file: `main.js` never touches contact-page DOM; `contact.js` never touches homepage DOM.
- CSS custom properties for every color/spacing decision — no hard-coded hex values inside component rules.

## Naming conventions
- kebab-case for files and asset names (`speciality-coffee-1.jpg`, not spaces).
- BEM-ish flat class names scoped by component (`.coffee-card`, `.coffee-card-media`) rather than deep nesting.

## Asset usage rules
- Only the provided, renamed assets are referenced — no stock imagery, no invented filenames, no blank placeholders.
- Every `<img>` has descriptive `alt` text; every autoplay `<video>` is `muted playsinline loop`.

## Responsive rules
- Fluid type/spacing via `clamp()`; fixed breakpoints only where the layout genuinely restructures (1080 / 860 / 560px).
- No fixed pixel widths on containers — `max-width` + `%`/`fr` only.

## Accessibility rules
- All interactive controls are real `<button>`/`<a>` elements with `aria-label`s where text isn't visible.
- Escape closes the mobile drawer, lightbox, and coffee-info modal; clicking the backdrop also closes them.
- Focus-visible states inherit from default browser outlines (not suppressed).
- `prefers-reduced-motion` disables scroll-triggered and hero animation.

## Animation rules
- One hero entrance timeline; scroll reveals fire once (`once: true` / natural fade-in), not on every scroll direction, to avoid jitter.
- No animation blocks pointer interaction (`pointer-events` never disabled during a reveal).

## Git rules
- `.env` is git-ignored; never commit real credentials.
- Large binary assets are project deliverables, not build artifacts — keep them versioned as-is.

## Security rules
- Backend never trusts client input without validation; all `/api/*` routes validate required fields and formats server-side too.
- CORS is restricted to `ALLOWED_ORIGINS` from the environment, not `*`.
- No SMTP credentials or API keys anywhere in frontend JS.

## Backend rules
- `emailed` in every API response reflects the real SMTP outcome — never hard-coded `true`.
- All config (SMTP, port, CORS origins) comes from environment variables via `.env`.

## General
- Do not break existing features when extending the site.
- Do not create broken asset paths.
- Do not leave `TODO` placeholders in required features.
