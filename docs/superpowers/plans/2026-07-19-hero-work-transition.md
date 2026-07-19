# Hero → Work Transition Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the pinned hero→work scroll transition on the home page (`src/components/LandingExperience.tsx`) actually show its "story curtain" reveal instead of two screens of dead black, and confirm/tune the shatter choreography and pin length now that it's visible.

**Architecture:** This is a CSS stacking-order bug plus GSAP ScrollTrigger timing, not an application-logic change. No new files, no new dependencies. The whole fix lives in `src/app/page.module.css` (one property change) and `src/components/LandingExperience.tsx` (timeline tuning, only if verification shows it's still needed).

**Tech Stack:** Next.js 16, GSAP 3 (`ScrollTrigger`, `useGSAP`), Lenis (`lenis/react`), plain CSS Modules. No test runner exists for this project (`npm run lint` only) — verification is manual browser scroll-testing per the design spec's testing plan, since this is pure motion/visual behavior with no unit-testable logic.

## Global Constraints

- Do not touch the Work/Capabilities/Process/Founders/Contact sections, the Book page, or the Studio page — verified working, out of scope (per `docs/superpowers/specs/2026-07-19-hero-work-transition-design.md`).
- Do not run `git commit` or `git push` — user has asked for local-only changes for now. Leave changes unstaged/uncommitted after each task; do not include commit steps.
- Respect the existing `prefers-reduced-motion` short-circuit in `LandingExperience.tsx`'s `useGSAP` callback — it must keep fully skipping the hero timeline.

---

## Root cause (from the design spec)

`.storyCurtain` (`src/app/page.module.css:56`) has `z-index: 1`. `.heroMedia` (`src/app/page.module.css:39`, the layer holding the keyboard video/images) has `z-index: 2` and its own opaque `background: #070707`. Because the curtain is stacked *underneath* an opaque layer, it is invisible for its entire on-screen life even though its own `opacity`/`transform` animate correctly (confirmed via computed-style inspection during diagnosis) — the user just sees flat black until the Work section slides up from off-screen.

`.hero::after` (`src/app/page.module.css:34`) is the vignette-shading overlay, `z-index: 3`. It is a pseudo-element of `.hero`, so per CSS stacking rules it always paints after (on top of) real DOM siblings at the same or lower z-index — this matters for Task 1.

---

### Task 1: Fix the curtain's stacking order

**Files:**
- Modify: `src/app/page.module.css:56`

**Interfaces:**
- Consumes: nothing — pure CSS property change.
- Produces: `.storyCurtain` now paints above `.heroMedia`, so its existing opacity/yPercent animation (driven by `LandingExperience.tsx`'s `heroTimeline`, unchanged in this task) becomes visible.

- [ ] **Step 1: Change the curtain's z-index**

In `src/app/page.module.css`, line 56, change:

```css
.storyCurtain{position:absolute;z-index:1;inset:0;overflow:hidden;opacity:0;background:radial-gradient(circle at 73% 48%,rgba(225,56,45,.16),transparent 33%),#0a0a0a;color:var(--ivory);display:grid;place-items:center}
```

to:

```css
.storyCurtain{position:absolute;z-index:3;inset:0;overflow:hidden;opacity:0;background:radial-gradient(circle at 73% 48%,rgba(225,56,45,.16),transparent 33%),#0a0a0a;color:var(--ivory);display:grid;place-items:center}
```

(Only the `z-index` value changes, `1` → `3`. This puts the curtain above `.heroMedia` (`z-index: 2`) and at the same numeric level as `.hero::after` (`z-index: 3`) — the vignette pseudo-element still paints on top of the curtain because pseudo-elements always paint after real DOM siblings at an equal z-index, so the subtle dimming overlay is preserved intentionally, not by accident.)

- [ ] **Step 2: Start the dev server**

Run: `npm run dev`
Expected: server starts on `http://localhost:3000` with no compile errors.

- [ ] **Step 3: Manually verify the curtain is now visible**

Open `http://localhost:3000` in a browser. Scroll down slowly from the top through the hero section (mouse wheel, small increments). Confirm:
- The keyboard "Enter" key press / shatter still plays as before.
- At some point during the shatter, the line **"Selected work / 2026"** and the headline **"Built to be used. Designed to be felt."** become visible and readable (not hidden behind solid black).
- There is no stretch of scrolling where the screen is flat black with nothing on it.

If the curtain is visible and readable: mark this task done and proceed to Task 2.
If it is still not visible: re-check that the edit in Step 1 was saved and the dev server picked up the CSS change (hard-refresh the browser), then re-verify before proceeding.

---

### Task 2: Re-verify full transition pacing and tune if needed

**Files:**
- Modify (conditionally): `src/components/LandingExperience.tsx:154` (the `end: "+=260%"` pin length)

**Interfaces:**
- Consumes: the fixed stacking order from Task 1.
- Produces: a hero→work transition where the full pinned scroll distance is doing something visible throughout (no long static or dead stretch), verified by direct observation.

- [ ] **Step 1: Scroll through the full pin at a normal pace and note timing**

With the dev server still running, reload `http://localhost:3000` and scroll through the entire hero pin at a normal, natural pace (the same way a real visitor would scroll — don't rush it, don't crawl it). Note:
- Whether the curtain content ("Selected work / 2026...") stays on screen long enough to actually read it, but not so long that scrolling feels like it's doing nothing.
- Whether the handoff into the `#work` section (the PlannrAI card sliding up) happens promptly after the curtain has been readable, or whether there's a noticeable "stuck" stretch of scrolling after the curtain settles where nothing changes before Work appears.

- [ ] **Step 2: Apply tuning only if a stuck/dead stretch is still present**

If Step 1 showed a stretch of scrolling with no visible change (curtain fully settled and static for a long scroll distance before Work appears), shorten the pin. In `src/components/LandingExperience.tsx`, line 154, change:

```ts
        end: "+=260%",
```

to:

```ts
        end: "+=190%",
```

This shortens the total scroll distance the pin covers by ~27% while the internal timeline's tween positions (the `0.02`, `0.14`, `0.3`, `0.44`, `0.7` fractions already in the timeline) stay proportionally the same — GSAP scrubs the whole timeline across whatever pin distance `end` specifies, so shortening `end` compresses the dead stretch without needing to touch each individual tween's position value.

If Step 1 showed good pacing already (curtain readable, prompt handoff, no dead stretch), skip this step — do not change `end` speculatively.

- [ ] **Step 3: Re-verify after any change**

If Step 2 was applied, hard-refresh `http://localhost:3000` and repeat the full scroll-through from Step 1. Confirm the dead stretch is gone and the curtain is still comfortably readable (not so fast it flashes by). If it now feels too rushed, adjust `end` upward in increments of `+=20%` and re-check until the pacing reads as intentional — comfortable to read, no idle stretch.

---

### Task 3: Guardrail check — reduced motion and mobile width

**Files:**
- None expected to change — this task is verification only, confirming the existing guardrails still hold against the (possibly) retimed pin from Task 2.

**Interfaces:**
- Consumes: the final state of the hero timeline from Tasks 1–2.
- Produces: confirmation that `prefers-reduced-motion` and the mobile breakpoint still behave correctly. No new code.

- [ ] **Step 1: Verify reduced motion**

In the browser, open DevTools → Rendering tab (Chrome/Edge) or equivalent, and emulate `prefers-reduced-motion: reduce`. Reload `http://localhost:3000`.
Expected: the hero renders in a static, settled state immediately — no keyboard shatter plays, no partial/stuck-mid-animation curtain, no console errors. This is controlled by the existing early-return in `LandingExperience.tsx`'s `useGSAP` callback (`if (reduced) return;`), which this plan does not modify — the check here is only to confirm Task 1/2's edits didn't accidentally regress it.

- [ ] **Step 2: Verify narrow viewport**

Resize the browser window to a narrow width (around 390–430px, a typical phone width) and reload `http://localhost:3000`. Scroll through the hero pin as in Task 2 Step 1.
Expected: the pin still resolves cleanly — curtain becomes visible and readable, no fragments or curtain content stranded in a half-transitioned state, text remains legible against the mobile hero rules already defined in the `@media (max-width: 800px)` block in `page.module.css`.

- [ ] **Step 3: Final full pass**

Do one more full slow scroll from the very top of the page through the hero, into the Work section, confirming nothing regressed: intro line animation, "press space to enter" prompt, keyboard press, shatter, curtain reveal, handoff into Work. This is the final sign-off for Phase 1.

---

## Self-Review Notes

- **Spec coverage:** Layering fix → Task 1. Choreography polish → folded into Task 2/3's live re-verification rather than a separate blind tuning pass, since the "glitchy" read observed during diagnosis was captured via frozen screenshots of a scrubbed animation and needs to be re-judged live, in motion, now that the actual bug (curtain invisibility) is fixed — speculatively rewriting the fragment motion math before seeing the corrected transition risks fixing something that was never actually broken. Retime the pin → Task 2. Guardrails (reduced motion, mobile) → Task 3. Out-of-scope sections → excluded per Global Constraints.
- **No placeholders:** every step has an exact file, line number, and either literal code or a literal manual-verification procedure with a concrete pass/fail description.
- **Type/name consistency:** only one identifier is referenced across tasks (`heroTimeline`'s `end` value at `LandingExperience.tsx:154`), and it's quoted identically in Task 2.
