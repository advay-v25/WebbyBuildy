# Scroll-Scrub Video Section — Debugging and Fixes

## Problems Identified and Resolved

### Problem 1: Scroll Scrubbing Not Working
**Symptom:** Scrolling did not drive the video. The video flickered/blinked but didn't advance through frames.

**Root Causes Found and Fixed:**

1. **Incorrect Pin Element**
   - **Original Issue:** Used `pin: videoPanel.current || true`, which might pin the trigger element (section) instead of the video panel
   - **Fix:** Changed to query the video panel by data attribute: `pin: container.querySelector('[data-video-panel]')`
   - **Why:** ScrollTrigger's `pin` parameter needs a reliable reference to the element to pin. Using a DOM query after mount ensures the element exists.

2. **Section Structure for Pinning**
   - **Issue:** The 500vh container needed to provide scroll range while only the 100vh video panel pins to viewport
   - **Structure:**
     - Container (500vh tall) = scroll range definition
     - Video panel (100vh) = gets pinned via `pin: videoPanel`
   - **Result:** User scrolls through 500vh of space, but only the 100vh video panel stays on screen

3. **Frame-Accurate Seeking**
   - **Issue:** Small frame time deltas could cause visible flickering/seek thrash
   - **Fix:** 
     - Round target time to frame boundaries: `Math.round(seconds / FRAME_DURATION) * FRAME_DURATION`
     - Skip redundant seeks by tracking the last-set frame number
     - Only call `video.currentTime = time` when the frame actually changes
   - **Benefit:** Eliminates seek artifacts and stutter

4. **Video Metadata Readiness**
   - **Issue:** Seeking before `loadedmetadata` fires silently fails
   - **Fix:** 
     - Check `video.readyState >= 1` to see if metadata is already loaded
     - Only create ScrollTrigger after `setIsVideoReady(true)`
     - Set `video.currentTime = 0` in the loadedmetadata handler to ensure first frame is ready

5. **Lenis Synchronization**
   - **Implementation:** `useLenis(() => ScrollTrigger.update())`
   - **Effect:** Every time Lenis fires a scroll event, it updates ScrollTrigger's internal state
   - **Benefit:** Ensures ScrollTrigger's progress values match Lenis smooth-scroll positions

### Problem 2: Wrong Placement
**Symptom:** Video section was appended at the end of the page instead of replacing the process section.

**Changes Made:**

1. **Removed Old Process Section**
   - Deleted the "From first call to live site" stages section with:
     - Talk / Proposal / Build / Launch dials
     - Red connecting line  
     - ACTIVE STAGE card
     - All associated scroll/hover animations

2. **Added Video Section in Process Position**
   - Placed ScrollScrubVideo component where the process section was
   - Kept "HOW IT WORKS" heading and "From first call to live site" text above video
   - New structure:
     ```
     <section id="process">
       <div class="headingOverlay">
         <p>HOW IT WORKS</p>
         <h2>From first call to live site</h2>
       </div>
       <ScrollScrubVideo />
     </section>
     ```

3. **Removed Duplicate Component**
   - Deleted ScrollScrubVideo from the end of LandingExperience

4. **Cleaned Up State and Animations**
   - Removed `activeProcess` state (no longer needed)
   - Removed `processNodesRef`, `processProgressRef`, `processNodesHoverRef` refs
   - Removed custom RAF loop for process node animations
   - Removed GSAP animations for process steps and signal

5. **Updated Styling**
   - Replaced `.processSection` and `.processTrack` with `.howItWorksSection`
   - Added `.headingOverlay` styles for pinned heading
   - Updated z-index stacking to reference `.howItWorksSection`
   - Updated media queries to match new section class names

## Technical Implementation Details

### Component Architecture

**ScrollScrubVideo.tsx:**
- Detects reduced motion preference
- Waits for video metadata to load
- Creates ScrollTrigger timeline with scrub effect
- Maps scroll progress to video currentTime
- Rounds to frame boundaries and skips redundant seeks
- Provides fallback for reduced motion

**CSS (ScrollScrubVideo.module.css):**
- Track: 500vh tall (300vh on mobile) = scroll context
- Video Panel: 100vh tall = pinned viewport element
- Video Element: 100% width/height with object-fit: cover
- Loading Placeholder: Animated until metadata loads

### Scroll Behavior

**Normal Flow:**
```
User scrolls ↓
  ↓
ScrollTrigger detects progress (0→1)
  ↓
onUpdate calculates: time = progress * 10 seconds
  ↓
Round to frame boundary (1/24s)
  ↓
Check if frame changed
  ↓
Only if changed: video.currentTime = time
  ↓
Video updates to new frame
  ↓
Repeat for each frame
```

**Reverse Scrolling:**
```
User scrolls ↑
  ↓
ScrollTrigger progress decreases
  ↓
Video time decreases
  ↓
Video plays backward through frames
```

**Release Points:**
- Downward: Only after progress = 1.0 (last frame, ~10 seconds)
- Upward: Only before progress = 0.0 (first frame)

## Debugging Tools & Logging

Console logs added for debugging (can be removed after testing):

```javascript
console.log("Video metadata loaded, duration:", video.duration);
console.log("Setting up ScrollTrigger for video scrubbing");
console.log(`Progress: ${progress}, Time: ${time}s, Frame: ${frame}`);
console.error("Video panel not found");
```

**To Debug:**
1. Open DevTools Console
2. Scroll into the video section
3. Watch for console messages showing progress/time/frame values
4. If no messages appear, the ScrollTrigger never initializes (check video metadata loading)

## Testing Checklist

### Critical Path
- [ ] Scroll into section → video panel pins to viewport (no jump)
- [ ] Slow scroll down → video advances frame-by-frame (no stutter)
- [ ] Scroll at end → page releases after final frame
- [ ] Scroll back up → video rewinds frame-by-frame
- [ ] Scroll at start → page releases before first frame

### Performance
- [ ] No flickering or blinking during scroll
- [ ] No seek-thrash (multiple seeks per frame)
- [ ] Smooth 60fps scrolling experience
- [ ] Mobile: acceptable performance on 300vh track

### Fallbacks
- [ ] Reduced motion: video plays with controls, no pinning
- [ ] No-JS: video renders, page scrolls through
- [ ] Mobile: pinning works on touch scroll

### Integration
- [ ] Lenis smooth scroll works with ScrollTrigger
- [ ] No conflicts with other pinned sections
- [ ] No z-index stacking issues

## Performance Optimization Notes

1. **Frame-Boundary Rounding:** Prevents seeking to fractional frames
2. **Redundant Seek Skipping:** Checks if frame changed before assigning `currentTime`
3. **will-change: transform:** Hints to browser that video panel will be transformed (pinned)
4. **Preload:** Video set to `preload="auto"` for faster loading
5. **Mobile Fallback:** Shorter track (300vh vs 500vh) if seeking is slow

## Known Limitations

1. **Hardcoded Video Duration:** If using a different video, update `VIDEO_DURATION = 10`
2. **Hardcoded Frame Rate:** Update `FRAME_DURATION = 1/24` for different fps
3. **No Audio:** Video is audio-stripped to allow stutter-free seeking
4. **One-time Setup:** ScrollTrigger is set up once per component mount

## Build & Deployment

- ✅ TypeScript compiles without errors
- ✅ CSS modules are scoped (no conflicts)
- ✅ Video file included in `public/videos/`
- ✅ No external CDN dependencies
- ✅ Works with Next.js build system

## References

- GSAP ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- Lenis Integration: https://docs.lenis.dev/
- Frame Rate: 24fps × 10 seconds = 240 frames total
