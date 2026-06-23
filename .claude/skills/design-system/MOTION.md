# Motion & Polish

Craft reference for animation. The root question is never "how do I animate this" but "should this move, and why." Distilled from Emil Kowalski's design-engineering philosophy.

## Decision framework (answer in order)

### 1. Should it animate at all?
Frequency decides. The more often a user triggers it, the less it should move.

| Frequency | Decision |
| --- | --- |
| 100+/day (keyboard shortcuts, palette toggle) | No animation, ever |
| Tens/day (hover, list nav) | Remove or drastically reduce |
| Occasional (modals, drawers, toasts) | Standard animation |
| Rare/first-time (onboarding, celebration) | Can add delight |

**Never animate keyboard-initiated actions** — they repeat hundreds of times daily and animation makes them feel slow.

### 2. What is the purpose?
Every animation answers "why does this move?" in one sentence: spatial consistency, state indication, feedback, explanation, or preventing a jarring jump. If the only answer is "it looks cool" and it's seen often, don't animate.

### 3. What easing?
- Entering/exiting → **ease-out** (fast start, feels responsive)
- Moving/morphing on screen → **ease-in-out**
- Hover/color → **ease**
- Constant motion (marquee, progress) → **linear**

**Never `ease-in` on UI** — it delays the first moment the user is watching, feeling sluggish. Built-in CSS curves are too weak; use custom ones:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);      /* UI interactions */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);  /* on-screen movement */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);   /* iOS-like drawer */
```

### 4. How fast?
| Element | Duration |
| --- | --- |
| Button press feedback | 100–160ms |
| Tooltips, small popovers | 125–200ms |
| Dropdowns, selects | 150–250ms |
| Modals, drawers | 200–500ms |

UI animations stay **under 300ms**. `ease-out` at 200ms _feels_ faster than `ease-in` at 200ms — perceived performance is real performance.

## Component principles

- **Buttons feel pressed.** `transform: scale(0.97)` on `:active`, transition ~160ms ease-out. Any pressable element.
- **Never `scale(0)` entry.** Nothing in the real world appears from nothing. Start `scale(0.95)` + `opacity: 0`.
- **Origin-aware popovers.** Scale from the trigger, not center (`transform-origin: var(--radix-popover-content-transform-origin)` / Base UI `var(--transform-origin)`). Exception: modals stay centered.
- **Transitions over keyframes** for anything rapidly re-triggered (toasts, toggles) — transitions retarget mid-flight, keyframes restart from zero.
- **`@starting-style`** for enter animations without JS; fall back to a `data-mounted` attribute where support is thin.
- **Blur masks imperfect crossfades.** A subtle `filter: blur(2px)` during a state swap blends two overlapping states into one. Keep under 20px (expensive in Safari).
- **Stagger** list entrances 30–80ms apart; never block interaction on it.
- **Asymmetric timing** — slow where the user is deciding (hold-to-delete, 2s linear), snappy where the system responds (release, 200ms ease-out).
- **Tooltips** delay on first hover, then open instantly for adjacent ones.

## Springs

Use for drag with momentum, interruptible gestures, and "alive" elements — they keep velocity when interrupted (CSS keyframes restart). Apple's model is easiest to reason about: `{ type: "spring", duration: 0.5, bounce: 0.2 }`. Keep bounce subtle (0.1–0.3); avoid it in most UI.

## Gestures (drag-to-dismiss)

- Dismiss on **velocity OR distance** — a quick flick (`|distance| / elapsed > ~0.11`) counts even if short.
- **Damping** past boundaries — the further dragged, the less it moves; no hard walls.
- **Pointer capture** on drag start so it survives leaving the element; ignore extra touch points.

## Performance (hard rules)

- **Animate only `transform` and `opacity`** — they skip layout/paint, run on the GPU. Never animate `width/height/top/left/margin/padding`.
- **Never `useState` for continuous values** (mouse, scroll, drag) — it re-renders the tree every frame and collapses on mobile. Write `transform` directly to a ref inside `requestAnimationFrame`, or use motion values. Reference: [`archive-constellation.tsx`](components/archive/archive-constellation.tsx).
- **Update transforms on the element, not a parent CSS variable** — changing an inherited var recalcs every child.
- `will-change: transform` only on elements that actually animate.
- CSS animations run off the main thread; prefer them for predetermined motion, JS for dynamic/interruptible. `useEffect`-driven animations need strict cleanup.

## Accessibility

- `prefers-reduced-motion: reduce` → remove movement and position animation; keep opacity/color that aids comprehension. Infinite loops, parallax, and physics collapse to static.
- Gate hover effects behind `@media (hover: hover) and (pointer: fine)` so touch taps don't trigger false hovers.

## Review format (required)

When reviewing UI code, output a single markdown table, one row per issue — never a "Before:/After:" list.

| Before | After | Why |
| --- | --- | --- |
| `transition: all 300ms` | `transition: transform 200ms ease-out` | Name exact properties; avoid `all` |
| `transform: scale(0)` | `scale(0.95); opacity: 0` | Nothing appears from nothing |
| `ease-in` on dropdown | custom `ease-out` curve | `ease-in` feels sluggish |
| no `:active` state | `scale(0.97)` on `:active` | Buttons must feel pressed |
| `useState` per scroll frame | `transform` to ref in `rAF` | Per-frame re-render drops mobile frames |
