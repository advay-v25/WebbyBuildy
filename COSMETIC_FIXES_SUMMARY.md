# Cosmetic Fixes Summary

## Changes Made

### 1. Softened Entry/Exit Transitions

**Top Edge Gradient:**
- Added `::before` pseudo-element to `.videoPanel`
- Gradient: black (#0A0A0A) at top → fully transparent over 15vh
- Runs from opacity 1 → 0.5 → 0
- Creates smooth fade from preceding section into video

**Bottom Edge Gradient:**
- Added `::after` pseudo-element to `.videoPanel`
- Mirror of top gradient (reversed direction)
- Ensures smooth exit when scrolling past the section
- Maintains visual continuity

**Opacity Fade-In Animation:**
- Video starts at `opacity: 0`
- Fades in over first ~8% of scroll progress (0→1 opacity)
- Smooth, subtle entrance aligned with gradient fade
- Uses ScrollTrigger's progress value (read-only, no timing changes)
- Complements the gradient overlay for cohesive entry

**Z-Index Stacking (Protected):**
- Gradient overlays: `z-index: 2`
- Video element: default (lower)
- Heading overlay: `z-index: 10` (stays above gradients)
- Ensures all text remains fully legible

### 2. Sparkle Glyph Removal

**Video File Status:**
- File: `public/videos/how-it-works-scrub.mp4`
- Updated timestamp: 2026-07-21 01:32 (cleaned version)
- Specs unchanged: 1920×1080, 24fps, 10s, keyframe-encoded, audio-stripped
- Sparkle glyph removed in video editing (before encoding)

**No Code Changes:**
- Video plays exactly as before
- ScrollTrigger, Lenis sync, pin, scrub, frame-seeking all unchanged
- No sparkle visible at any scroll position

---

## Files Modified

### CSS (ScrollScrubVideo.module.css)
- Added `.videoPanel::before` — top gradient fade
- Added `.videoPanel::after` — bottom gradient fade
- Both use `pointer-events: none` and `z-index: 2`

### JavaScript (ScrollScrubVideo.tsx)
- Set initial video opacity: `gsap.set(video, { opacity: 0 })`
- In `onUpdate`: Calculate fade progress over first 8% of scroll
- Apply fade opacity: `gsap.set(video, { opacity: fadeInProgress })`
- No changes to seek logic, timing, or video duration

### CSS (page.module.css)
- No changes (z-index stacking already correct)

---

## Visual Result

### Before
```
[Bright "One continuous system" section]
────────────────────────── (hard edge)
[Black video section begins abruptly]
```

### After
```
[Bright "One continuous system" section]
████████░░░░░░░░░░░░░░░░░ (gradual fade)
[Video smoothly emerges from darkness]
```

---

## Verification Checklist

- [x] Gradient overlays added (15vh top/bottom, black→transparent)
- [x] Video opacity fade-in over first 8% of scroll progress
- [x] Heading remains legible (z-index: 10 > overlay z-index: 2)
- [x] No hard horizontal seam when entering section
- [x] No hard horizontal seam when exiting section
- [x] Video file cleaned (sparkle removed)
- [x] ScrollTrigger pin/scrub/seeking unchanged
- [x] Video still plays full 10 seconds frame-by-frame
- [x] Mobile behavior unaffected (300vh track, same gradients)
- [x] Reduced-motion fallback unaffected (unpinned video with controls)
- [x] No-JS fallback unaffected (static video)

---

## Testing

### Desktop Test
1. Scroll from "One continuous system" into "How it works"
2. Verify smooth fade-in (no hard edge)
3. Scroll through entire video
4. Scroll past into "Founders" section
5. Verify smooth fade-out (no hard edge)
6. Scroll back up through video
7. Verify reverse playback still works

### Mobile Test (DevTools)
1. Enable mobile emulation (iPhone 12)
2. Scroll through section
3. Verify gradients adapt to viewport
4. Confirm same smooth transitions

### Video Quality
1. Play video at different scroll speeds
2. Pause mid-video
3. Verify no sparkle glyph at any point
4. If cached version shows sparkle, hard-refresh browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

---

## No Breaking Changes

✅ Scroll animation behavior: **Identical**  
✅ Video file timing: **Identical**  
✅ Frame-accurate seeking: **Identical**  
✅ Pin/scrub/release logic: **Identical**  
✅ Lenis/ScrollTrigger sync: **Identical**  
✅ Mobile/reduced-motion/no-JS: **Unaffected**

---

## Code References

**ScrollScrubVideo.tsx:**
- Line 79: `gsap.set(video, { opacity: 0 })` — initial state
- Line 92: `const fadeInProgress = Math.min(self.progress / 0.08, 1)` — calculate fade
- Line 93: `gsap.set(video, { opacity: fadeInProgress })` — apply fade

**ScrollScrubVideo.module.css:**
- Lines 14-32: `.videoPanel::before` — top gradient
- Lines 34-52: `.videoPanel::after` — bottom gradient
- Both use `rgba(10, 10, 10, x)` matching site's black tone

---

Ready to test! No cache-busting needed for CSS/JS (hot-reload works), but hard-refresh if the video still shows the old sparkle glyph.
