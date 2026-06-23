# Anti-Slop & Layout

Taste reference: how to compose a page and what to never ship. Distilled from the anti-slop frontend philosophy, scoped to this site's locked system (so the color/font rules already collapse most "tells").

LLM design output is bad when the model jumps to a default aesthetic. Reach past the defaults deliberately.

## Anti-default discipline

Do not default to: AI-purple gradients, centered hero over a dark mesh, three equal feature cards, glassmorphism on everything, infinite micro-animations, Inter + slate. This site has already made the big choices (warm amber accent, Figtree, dark mode) — honor them and spend your invention on composition.

## Layout discipline (hard rules)

- **Hero fits the initial viewport.** Headline ≤ 2 lines, subtext ≤ 20 words, CTA visible without scroll. Plan font scale _with_ the asset size; a 4-line headline is a font-size error, not a copy problem. Hero top padding ≤ `pt-24`.
- **Hero stack ≤ 4 text elements** (eyebrow OR brand strip, headline, subtext, CTAs). No tagline below the CTAs, no trust micro-strip inside the hero — those become sections below it.
- **Navigation on one line** at desktop, height ≤ 80px. Condense or collapse to a menu before wrapping.
- **No three equal feature cards.** Use a 2-column zigzag, asymmetric grid, or scroll-pinned layout. Cap consecutive image+text splits at 2.
- **Section-layout variety** — a layout family appears at most once. 8 sections → ≥ 4 different families.
- **Eyebrow restraint** — the small uppercase tracking label above a headline. Max 1 per 3 sections (hero counts as 1). Usually just drop it; the headline is enough.
- **No split-header** (big left headline + small floating right paragraph). Stack headline over body instead.
- **One radius system, one accent, one theme** across the whole page (see SKILL.md tokens).
- **Mobile collapse is explicit** per section: high-variance layouts go single-column (`w-full px-4`) under 768px. Use `min-h-[100dvh]`, never `h-screen`. Contain with `max-w-7xl mx-auto`.
- **Full interaction states** — loading (skeletons matching final shape, not spinners), empty (composed, shows how to populate), error (inline for forms), and tactile `:active` feedback.
- **Buttons & forms pass WCAG AA contrast** (4.5:1 body, 3:1 large). No white-on-white CTAs, no CTA label wrapping to two lines, no placeholder-as-label. Label above input, error below.

## Images

Landing pages and portfolios are visual products; text + gradient blob is a placeholder, not a hero. Priority: generate section-specific assets if an image tool exists → else real photography (`https://picsum.photos/seed/{descriptive-seed}/{w}/{h}`) → else leave a labeled `<!-- TODO -->` slot and say so. Even minimalist pages need 2–3 real images.

- **Never div-based fake screenshots** (fake dashboards/terminals built from styled divs) — the #1 tell. Use a real screenshot, a generated image, or a real mini-component.
- **Logo walls** use real SVG marks (Simple Icons / devicon) or a generated monogram, not plain text wordmarks. Logo only — no category label under each. Lives under the hero, never inside it.
- **Icons** from one library only (Phosphor / HugeIcons / Radix / Tabler; this repo uses `lucide-react`). Never hand-roll SVG icon paths. Standardize `strokeWidth`.

## Content density

First impression, not full read. Cut ruthlessly.

- Per section: headline ≤ 8 words + sub-paragraph ≤ 25 words + one asset or one CTA.
- **No data-dump sections.** A long spec table with a hairline under every row is the laziest layout — group into 2–3 clusters, or use a card-per-item grid, or a "view full list" disclosure.
- **Lists > 5 items** need a real component (column split, card grid, tabs, scroll-snap), not a longer `<ul>`.
- **No fake-precise numbers** (`92%`, `4.1×`, `5.8mm`) unless real or labeled mock.
- **Copy self-audit** before shipping: re-read every visible string. Cut anything grammatically broken, with unclear referents, or trying-to-sound-thoughtful AI cuteness. Plain functional copy beats clever-but-wrong.
- **One copy register** per page. No generic names ("John Doe"), no startup-slop brands ("Acme", "Nexus"), no filler verbs ("Elevate", "Seamless", "Unleash").
- **Quotes ≤ 3 lines**, attribution = name + role (never name alone).

## The em-dash ban

**Em-dash (`—`) and en-dash-as-separator (`–`) are completely banned** anywhere visible: headlines, eyebrows, pills, body, quotes, attribution, captions, buttons, alt text. No "use sparingly" — zero. Restructure: a period, a comma, a colon, parentheses, or two sentences. Ranges use a hyphen (`2018-2026`, `€40-80k`). The only allowed dash is the regular hyphen `-`.

## Tells banned outright

- No version labels in the hero (`V0.6`, `BETA`, `EARLY ACCESS`) unless the brief is a launch.
- No section-number eyebrows (`00 / INDEX`, `001 · Capabilities`, `06 · how it works`).
- No decorative status dots by default — only for real semantic state, sparingly.
- No `·`-as-default-separator (max 1 per metadata line).
- No `<br>`-broken italicized headlines as a "design move"; no vertical rotated text; no decorative crosshair/grid lines.
- No "Quietly in use at", "From the field", "Field notes", weather/locale/time strips, or photo-credit captions as decoration.
- No scroll cues (`Scroll`, `↓ scroll`, animated mouse-wheel).
- No micro-meta-sentences under eyebrows; no generic step labels ("Stage 1 / Stage 2").
- No `border-t` + `border-b` on every row of a long list.
- No floating top-right sub-text in section headers; no hero-bottom decoration strip (`BRAND. MOTION. SPATIAL.`).

## Out of scope

This system is for marketing/landing/portfolio/about surfaces. It does not improve dashboards, dense data tables, multi-step wizards, or code editors — say so and point elsewhere if a request is one of those.

## Pre-flight

Run before shipping anything beyond a trivial change. Every box ticks honestly or the page is not done.

- [ ] **Design read** declared, three dials set?
- [ ] **Zero em-dashes** anywhere visible (headlines, body, labels, captions, alt text)?
- [ ] **One accent** (the amber), **one theme**, **one radius system** across the whole page?
- [ ] **Tokens, not hex** — every color/font/radius traces to `globals.css`? No Inter, no serif?
- [ ] **Hero** fits viewport (≤ 2-line headline, ≤ 20-word subtext, CTA above the fold), ≤ 4 text elements, top padding ≤ `pt-24`?
- [ ] **Eyebrow count** ≤ ceil(sections / 3)?
- [ ] **Nav** on one line, ≤ 80px?
- [ ] **Layout variety** — no family twice, ≤ 2 consecutive image+text splits, no three-equal cards, no split-header?
- [ ] **Real images** (generated / Picsum-seed / labeled slot), no div fake-screenshots, no hand-rolled decorative SVG?
- [ ] **Logo walls** = real/generated SVG marks, logo-only, under the hero?
- [ ] **Content density** sane — no 20-row tables, lists > 5 use a real component, no fake-precise numbers?
- [ ] **Copy self-audit** done — no broken or AI-cute strings, no Jane Doe / Acme / filler verbs?
- [ ] **Buttons & forms** pass WCAG AA, no wrapped CTA, no placeholder-as-label, full loading/empty/error states?
- [ ] **Motion** (see [`MOTION.md`](MOTION.md)) — each animation justified in a sentence, only `transform`/`opacity`, no per-frame `useState`, reduced-motion wrapped?
- [ ] **Mobile collapse** explicit, `min-h-[100dvh]` not `h-screen`, contained with `max-w-7xl`?
- [ ] **No banned tells** — version labels, section-number eyebrows, decorative dots, scroll cues, locale strips, hero-bottom strips?
