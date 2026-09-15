# Design — Whimsy Brews cafe

## Inspiration
Built from the supplied reference screenshot: a near-black espresso interior lit by warm brass/gold accents, thin hairline rules, a serif display headline paired with tracked-caps gold eyebrow labels, and cream-paper cards used sparingly as contrast surfaces. The layout, section order and carousel/card patterns follow that reference closely; imagery was swapped for the café's own provided photography and video.

## Brand identity
**Aurelia Coffee & Café** — a specialty roaster-café built around traceable single-origin beans and a room worth lingering in. Voice: warm, unhurried, specific (never generic "great coffee, great vibes" copy).

## Color palette
| Token | Hex | Use |
|---|---|---|
| `--espresso-950` | `#0c0906` | Page background |
| `--espresso-900` | `#130f0a` | Section surfaces |
| `--espresso-850` | `#1a140d` | Cards / inputs |
| `--cream` | `#f4ecdd` | Light contrast surfaces |
| `--gold` | `#d8b36a` | Primary accent, links, borders |
| `--gold-strong` | `#c9a24a` | Buttons, price tags |
| `--text-hi` / `--text-mid` / `--text-low` | `#f6efe3` / `#cabfa9` / `#8f8471` | Text hierarchy |

## Typography
- **Fraunces** (serif, variable) — display headlines and card titles. Set at 400 weight, generous size, occasional italic for a single accent phrase in the hero.
- **Jost** (sans) — body copy, navigation, labels, buttons, tracked-caps eyebrows.

## Layout system
- 1240px max content width, fluid `clamp()` spacing.
- Hero: two-column (copy left, Three.js stage right) collapsing to stacked on tablet/mobile.
- Alternating full-bleed section backgrounds (`espresso-950` / `espresso-900`) separate sections without heavy dividers — just a 1px gold-tinted hairline.
- Cards use one consistent radius scale (6 / 14 / 26px) tied to element size, not a single global radius.

## Animation
- One orchestrated hero entrance (staggered fade/slide) on load.
- GSAP ScrollTrigger reveals sections once, on enter — not repeated on every scroll direction.
- Three.js hero: cursor-driven parallax tilt on the coffee cup (bounded, never a full rotation) plus ambient floating bean motion.
- `prefers-reduced-motion` disables all non-essential motion; content still appears (no permanently-hidden elements).

## Asset usage
| Provided asset | Section |
|---|---|
| `background-video.mp4` | Hero ambient backdrop (behind the Three.js stage) |
| `coffee-cup.png` | Three.js hero mesh, cursor-interactive |
| `coffee-beans.png`, `coffee-beans-1.png` | Floating Three.js beans |
| `speciality-coffee/*` | Rare Coffee Collection carousel |
| `interior/*` | Gallery / "Fun in Our Coffee Space" |
| `stories-section/*` | About section hero video + "Stories, Tips & More" cards |
