---
name: design-system
description: The design system for arthurduarte.dev. Use when building, redesigning, or styling any page or component in this repo, or when choosing color, type, spacing, surfaces, or motion. Combines the project's locked visual tokens with motion-craft and anti-slop discipline.
---

# Design System — arthurduarte.dev

Two forces govern every screen: **taste** decides _what_ you build, **craft** decides _how it feels_. They bracket the work — taste up front, craft throughout, both checked at the end.

Every page runs the same three steps:

1. **design read** — declare intent before code
2. **build** — compose against the locked system
3. **pre-flight** — gate the output before shipping

The ethos underneath: **unseen details compound**. Most of what makes this site feel considered, no visitor consciously notices. Build for the aggregate.

## Step 1 — design read

Before any code, state one line: **"Reading this as: \<page kind> for \<audience>, with a \<vibe> language."** Then set three dials that drive density and motion:

- `VARIANCE` (layout symmetry → asymmetry)
- `MOTION` (static → cinematic)
- `DENSITY` (airy → packed)

This site's baseline is **calm and precise**: `VARIANCE 6 / MOTION 5 / DENSITY 3`. Push up for playful/experimental surfaces (the archive constellation runs 8/7/4), down for reading-heavy pages. If the read genuinely forks the design, ask **one** question; otherwise declare and proceed.

**Completion criterion:** the design-read line is written and the three dials have explicit values.

## Step 2 — build against the locked system

These tokens are the project's identity. They are not per-page choices — they are the constant that makes every page look like _this_ site. Source of truth: [`app/globals.css`](app/globals.css). Never hardcode a hex; reach for the token.

### Color — one accent, locked
- **Dark mode, always on** (`<html className="dark">`). Warm-neutral OKLCH base, background `oklch(0.2178 0 0)`. No pure black, no pure white.
- **The accent is warm amber: `--primary oklch(0.77 0.16 70)`.** It is the _only_ hue. Never introduce a second accent color on any page. (This single rule satisfies the color-consistency lock and makes AI-purple impossible.)
- `--chart-1..5` is an amber ramp — use it, and only it, when one accent needs multiple distinguishable values (clusters, categories, data).
- Borders are translucent white (`--border` = white 10%). Surfaces are `bg-card` at 40–80% with `backdrop-blur` for anything floating over content — the **glass control-rail** pattern (see the archive overlay).

### Type
- **Figtree** (`--font-sans`) for display and body. **Geist Mono** (`--font-mono`) for numbers, metadata, and small labels.
- Never Inter. Never a serif. Emphasis inside a heading = weight or italic of the _same_ family, never a second font.

### Shape & surface
- Radius scale derives from `--radius` (0.625rem): `sm/md/lg/xl`. Pick one rhythm per surface and hold it — round buttons in a square layout is broken.
- Tinted shadows only (shadow hue follows the surface), never pure-black drop shadows.

### Component conventions
- UI primitives live in [`components/ui/`](components/ui): **Base UI** wrapped with `cva` for variants, merged with **`cn()`** from [`lib/utils.ts`](lib/utils.ts).
- Server components by default; add `"use client"` only on interactive leaves. Import via `@/*`.
- Tailwind v4 utilities + the `dark:` variant; tokens over literals.

For layout composition and the full catalog of patterns to avoid, read [`ANTI-SLOP.md`](ANTI-SLOP.md).

**Completion criterion:** every color, font, and radius traces to a token above; no second hue, no Inter/serif, no hardcoded hex.

## Step 3 — motion

Motion is **craft**, gated by the `MOTION` dial and by frequency: the more often a user sees an animation, the less it should move. Drive continuous values (drag, scroll, physics) by writing `transform` straight to refs inside `requestAnimationFrame` — **never** `useState` per frame. The reference implementation is [`archive-constellation.tsx`](components/archive/archive-constellation.tsx).

Core defaults: custom `ease-out` curves (not the weak built-ins), UI animations under 300ms, `scale(0.97)` on `:active`, never animate from `scale(0)`, animate only `transform`/`opacity`, honor `prefers-reduced-motion` above the lowest intensity.

The full decision framework, easing curves, gesture mechanics, and the required review-table format live in [`MOTION.md`](MOTION.md). Read it before writing animation code or reviewing it.

**Completion criterion:** every animation has a one-sentence purpose; reduced-motion degrades it; no per-frame React state.

## Step 4 — pre-flight

The closing gate. These are the hard fails — if any is true, the output is not done. The exhaustive checklist is in [`ANTI-SLOP.md`](ANTI-SLOP.md#pre-flight); run it for anything beyond a trivial change.

- **Zero em-dashes (`—`) anywhere visible.** Headlines, body, labels, captions, alt text. Use a hyphen, comma, or two sentences. Non-negotiable.
- **One accent** — the amber is the only hue across the whole page.
- **One theme** — no section inverts the page's light/dark.
- **Hero fits the viewport** — headline ≤ 2 lines, CTA visible without scroll.
- **Real images**, not div-based fake screenshots or hand-rolled decorative SVG.
- **Reduced motion** wrapped for anything that moves.
- **No AI tells** — no Inter default, no AI-purple, no three-equal feature cards, no decorative eyebrows on every section, no scroll cues, no fake-precise numbers.

**Completion criterion:** every box above ticks honestly; for non-trivial pages, the full [`ANTI-SLOP.md`](ANTI-SLOP.md#pre-flight) checklist passes.
