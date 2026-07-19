# Hero → Work Transition Fix — Design

**Status:** Approved for implementation
**Scope:** Phase 1 of the WebbyBuildy cinematic redesign (home page only). Phases 2/3 (Book/Studio content + new interactive elements) are out of scope for this spec and will get their own design pass later.

## Context

The site is a Next.js 16 / GSAP / Lenis / Framer Motion cinematic marketing site for a web design studio. The home page (`src/components/LandingExperience.tsx`) opens with a pinned, scroll-scrubbed hero: a keyboard image "shatters" into fragments, a "story curtain" panel is meant to fade in with the line *"Selected work / 2026 — Built to be used. Designed to be felt."*, and the page then hands off into the `#work` section (PlannrAI project showcase).

Manual browser testing (real mouse-wheel scroll through the live dev server, cross-checked against computed styles) confirmed the rest of the site — the Work/Capabilities/Process/Founders/Contact scroll-reveal system, the Book page, and the Studio page — all render and animate correctly. The hero→work transition is the one confirmed broken piece.

## Confirmed bug

`.storyCurtain` (`src/app/page.module.css`, `z-index: 1`) sits underneath `.heroMedia` (`z-index: 2`), which carries its own opaque `background: #070707`. The GSAP timeline in `LandingExperience.tsx` (`heroTimeline`, the `hero-cinematic` ScrollTrigger) fades the keyboard image, pressed-state image, and fragments to `opacity: 0`, but never touches `.heroMedia`'s own background. Because that background is opaque and stacked above the curtain, the curtain text renders (confirmed via computed style: `opacity: 1`) but is never visible — the user sees roughly two full viewport-heights of dead black scroll before the Work section's PlannrAI card slides up from off-screen.

Secondary issue: the keyboard "fragment" shatter (`[data-keyboard-fragment]`, 28 tiled pieces animated via per-column/per-row offsets) reads as scattered, misaligned image debris rather than a deliberate cinematic break — the offsets aren't relative to a shared explosion origin, so the pieces don't move as a cohesive event.

## Design

### 1. Layering restructure

- Fade `.heroMedia`'s own background (not just its children) out during the shatter window of `heroTimeline`, so it stops acting as an opaque backstop once the keyboard visuals are meant to be gone.
- Reorder stacking so `.storyCurtain` sits above the now-transparent `.heroMedia` base. `.keyboardFragments` stays on top of the curtain, so fragments read as debris flying in front of text that's emerging behind them — matching what the existing timing (fragments and curtain overlapping between progress ~0.1–0.3) already implies but never delivers visually.
- `.hero::after` (the vignette gradient, currently `z-index: 3`, already self-clears via `--hero-shade-opacity` by progress 0.3) keeps its position above everything — it's a translucent overlay, not a blocker, so no change needed there beyond confirming it still reads correctly against the new stack.

> **As shipped:** only the `.storyCurtain` z-index change (1 → 3) was implemented; the `.heroMedia` background-fade and the fragment-above-curtain reordering described above were not — the plan's Task 1 found the single z-index fix sufficient (`.keyboardFragments` stays inside `.heroMedia`, so fragments now render *behind* the curtain rather than in front of it, per the final code review). Verified live and looks correct; the "fragments in front" layering above is the original design intent, not what's currently in the code.

### 2. Fragment choreography polish

- Replace the per-column/per-row offset math with motion relative to a shared center origin, so the 28 pieces read as one explosion rather than independent drifting tiles.
- Tighten the stagger and align the blur/fade-out curve so every fragment has fully cleared (opacity 0) before it would visually overlap the curtain copy — currently fragments and curtain fade are concurrent with no guarantee of that ordering.

### 3. Retime the pin

- The pinned `ScrollTrigger` (`id: "hero-cinematic"`) currently runs `end: "+=260%"` — longer than the content inside it, which is the direct cause of the dead scroll. Shorten the pin distance and re-balance the internal timeline's position parameters (currently hand-tuned fractions like `0.02`, `0.14`, `0.3`, `0.44`, `0.7`) so every scroll-inch maps to visible motion: key press → shatter → curtain reveal → handoff into `#work`.
- Exact percentage is a tuning value, not fixed here — it should be set by scrolling the live result and adjusting until there's no idle stretch, keeping the existing `enterSite()` "press space" scroll-to-work destination logic consistent with the new pin length.

### 4. Guardrails

- Keep the existing `prefers-reduced-motion` short-circuit (`LandingExperience.tsx` `useGSAP` callback already returns early on `reduced`) working against the retimed timeline — no separate reduced-motion path needs to be authored, just verify the early return still fully skips the new pin/timeline additions.
- Re-check the existing mobile hero rules (`@media (max-width: 800px)` block in `page.module.css`) still make sense against the new pin length; the hero's mobile `min-height` and copy positioning aren't expected to need changes, but should be spot-checked.

## Testing plan

Manual scroll-through against the running dev server (`npm run dev`), since this is a pure motion/visual change with no unit-testable logic:

- Slow drag-scroll and fast wheel-flick through the full hero pin — confirm the curtain text is legible at some point during the scroll and there is no stretch of dead black screen.
- Keyboard `PageDown` navigation through the same region (exercises Lenis's programmatic scroll path, not just wheel).
- `prefers-reduced-motion: reduce` emulated — confirm the hero renders in its static end-state immediately, no broken partial-animation state.
- Narrow viewport (mobile breakpoint) — confirm the pin still resolves cleanly and doesn't strand fragments/curtain in a mismatched state.

## Out of scope

- Any change to the Work/Capabilities/Process/Founders/Contact sections, Book page, or Studio page — these were verified working and are not part of this fix.
- New content, imagery, or copy — this is purely a motion/layering correction to the existing hero.
