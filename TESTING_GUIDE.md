# Scroll-Scrubbed Video Section — Testing Guide

## Quick Start
```bash
# Install dependencies (if not already done)
pnpm install

# Start the dev server
pnpm run dev

# Navigate to http://localhost:3000
# Scroll past the contact section to see the "How it works" video section
```

## Testing Steps

### 1. Visual Integration
- [ ] Page loads without errors
- [ ] "How it works" section appears after contact section
- [ ] Video loads (you should see the first frame or a loading placeholder)
- [ ] Heading "How it works" is visible at the top of the section

### 2. Scroll Behavior (Desktop)
- [ ] Scroll down toward the section
- [ ] As you enter the section, the video panel sticks to the viewport (pins)
- [ ] Continue scrolling down — the video advances frame by frame
- [ ] Video should play smoothly without stuttering
- [ ] At the end frame (10 seconds), continued scrolling releases the pin and continues to next section

### 3. Reverse Scrolling
- [ ] Scroll back up through the video section
- [ ] Video should rewind frame by frame
- [ ] When you reach the first frame, scrolling up releases the pin
- [ ] Page scrolls normally above the section

### 4. Frame Accuracy
- [ ] Scroll slowly through the video
- [ ] Watch for smooth, frame-by-frame playback
- [ ] No frames should be skipped or doubled
- [ ] No seek audio artifacts (because audio is stripped)

### 5. Apple-Style Smoothness
- [ ] Fast scroll should accelerate playback smoothly (not jumpy)
- [ ] Slow scroll should show each frame clearly
- [ ] Damped scrolling should feel responsive, not laggy (this is the `scrub: 0.5` effect)

### 6. Mobile Testing (DevTools)
Enable mobile device emulation in browser DevTools (or use actual device):
- [ ] Section pins properly on touch scroll
- [ ] Video seeking is responsive (not slow/stalled)
- [ ] Scroll track is 300vh instead of 500vh (OK for better mobile perf)

### 7. Reduced Motion Testing
Open DevTools and set prefers-reduced-motion:
```javascript
// In browser console:
// Chrome/Firefox DevTools → Rendering → Emulate CSS media feature (prefers-reduced-motion: reduce)
```
- [ ] Video panel does NOT pin
- [ ] Video renders in normal block layout
- [ ] Play/pause controls appear
- [ ] Scrolling goes straight through without interaction

### 8. No-JavaScript Fallback
Disable JavaScript in browser settings:
- [ ] Video still renders
- [ ] No pinning/scroll effects (as expected)
- [ ] Browser can still scroll past it normally

### 9. Coexistence with Process Section
Scroll through the full page in both directions:
- [ ] Process section (stages grid) still works correctly
- [ ] Video section follows and doesn't conflict
- [ ] Both pinned sections work without ScrollTrigger errors
- [ ] No z-index stacking issues

### 10. Build & Export
```bash
# Test the production build
pnpm run build

# Check that video is included in output
ls -lh out/videos/how-it-works-scrub.mp4

# Test production output (requires a server to serve static files)
npx serve out
```

## Debugging Tips

### Video Not Loading
- Check browser console for 404 errors
- Verify file path: should be `/videos/how-it-works-scrub.mp4`
- Check CORS headers if in production

### Video Stuttering
- Verify video codec: should have every frame as keyframe (`-g 1`)
- Check network tab for video download speed
- On mobile, the reduced track height (300vh) may help

### Pinning Not Working
- Check that ScrollTrigger is registered: `gsap.registerPlugin(ScrollTrigger)`
- Verify Lenis sync: should see `ScrollTrigger.update()` in Lenis scroll events
- Check browser console for GSAP warnings

### Scroll Direction Issues
- Verify `onUpdate` callback is receiving correct progress values
- Test with both mouse wheel and trackpad scrolling
- Test with touch scroll on mobile

## Browser Compatibility
Tested for:
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (macOS and iOS)
- [ ] Edge (latest)

iOS Safari Note: Requires `muted` + `playsInline` for programmatic seeking to work. This is already included in the component.

## Performance Checklist
- [ ] No console errors or warnings
- [ ] Scroll performance is smooth (60fps target)
- [ ] No memory leaks (check DevTools Memory tab)
- [ ] Lenis and GSAP are synchronized (smooth scroll feel)

## Expected Behavior Summary
1. **Desktop**: Full 500vh track, smooth frame-accurate scrubbing, damped Apple-style feel
2. **Mobile**: 300vh track (shorter for performance), same scrubbing behavior
3. **Reduced Motion**: No pinning, plays like a normal video block with controls
4. **Release Point**: Only at frame 0 (upward) and frame 240 (10s × 24fps, downward)

---

If anything doesn't match these expectations, check the implementation notes in `SCROLL_SCRUB_VIDEO_NOTES.md`.
