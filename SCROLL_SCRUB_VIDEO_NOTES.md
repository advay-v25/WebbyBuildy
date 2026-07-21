# Apple-Style Scroll-Scrubbed Video Section Implementation

## Overview
Added a new `ScrollScrubVideo` component that creates an Apple-style scroll-driven video section using GSAP 3.15, ScrollTrigger, and Lenis 1.3.

## Component Details

### Files
- **Component:** `src/components/ScrollScrubVideo.tsx`
- **Styles:** `src/components/ScrollScrubVideo.module.css`
- **Integration:** Added to `src/components/LandingExperience.tsx` after the contact section

### Key Features
1. **Scroll-Driven Playback**: Scroll progress (0→1) maps linearly to video time (0→10 seconds)
2. **Frame-Accurate Seeking**: All seeks are rounded to frame boundaries (1/24s intervals) to avoid seek-thrash
3. **Pinned Section**: The video panel is pinned full-viewport while the 500vh scroll track provides scroll space
4. **Damped Feel**: Uses `scrub: 0.5` for Apple-style smoothed scrubbing
5. **Bidirectional**: Scrolling backward plays the video in reverse
6. **Frame Release**: Page only releases:
   - Downward when video reaches the final frame (progress 1.0)
   - Upward when video is at the first frame (progress 0.0)

### Technical Approach
- Uses `ScrollTrigger` with `pin: true` to pin the video panel
- Uses `onUpdate` callback to calculate target video time and perform frame-accurate seeks
- Skips redundant seeks by comparing against the last-set time (threshold: ±0.5 frame)
- Integrates with Lenis via `useLenis(() => ScrollTrigger.update())` for smooth scroll sync

### Fallbacks

#### Reduced Motion
When `prefers-reduced-motion: reduce` is detected:
- Disables ScrollTrigger pinning and scrubbing
- Renders the video in a normal block layout
- Adds play controls so users can control playback
- No scroll-jacking behavior

#### Mobile
- Track height reduced to 300vh instead of 500vh for better performance
- Same scroll-driven behavior as desktop
- iOS Safari: `muted` + `playsInline` attributes ensure programmatic seeking works

#### No JavaScript
- Video renders as a normal paused element with standard browser controls
- Page scrolls through without interaction
- Graceful degradation

## Video Asset
- **File:** `public/videos/how-it-works-scrub.mp4`
- **Specs:** 1920×1080, 24fps, 10 seconds, keyframe-encoded (every frame)
- **Purpose:** Animation portion first, then in-video text (exactly in source order)

## Testing Checklist

### Desktop
- [ ] Scroll into section - video panel pins to viewport
- [ ] Scroll down - video plays forward frame-by-frame
- [ ] Scroll up - video plays backward frame-by-frame
- [ ] Scroll slowly - verify frame-accurate playback (no stuttering)
- [ ] Reach end frame - scroll further and page releases
- [ ] Scroll back to beginning - re-enters section and pins again
- [ ] Verify smooth damped feel (not jerky)

### Mobile (iOS)
- [ ] Pinning works on touch scroll
- [ ] Video seeking is performant (no stalls)
- [ ] Animation plays in correct order
- [ ] Touch scrolling is smooth (via Lenis)

### Reduced Motion
- [ ] Prefers-reduced-motion detection works
- [ ] Video renders with play controls
- [ ] No pinning/scroll-jacking occurs
- [ ] Video plays normally with user controls

### Coexistence with Process Section
- [ ] Scroll through process section (stages) - no conflicts with video section
- [ ] Scroll down to video section - both pinned sections work sequentially
- [ ] Scroll back up through both sections - no ScrollTrigger conflicts
- [ ] `ScrollTrigger.refresh()` called after mount (via useGSAP)

## Build & Deployment
- Video file automatically included in build output (`out/videos/how-it-works-scrub.mp4`)
- Component uses CSS modules (scoped styles)
- No external CDN dependencies
- TypeScript types included

## Performance Notes
- **Seek Throttling:** Only seeks when target frame differs by >0.5 frames from last-set time
- **Will-change:** Applied to videoPanel for GPU acceleration
- **Preload:** Video set to `preload="auto"` for faster loading
- **Loading State:** Shows placeholder while metadata is loading

## Known Considerations
- Video duration is hardcoded to 10 seconds (matches the asset)
- Frame rate is hardcoded to 24fps (matches the video encoding)
- If using a different video, update `VIDEO_DURATION` and `FRAME_DURATION` constants in the component
- Poster image references removed (video loads and shows first frame on loadedmetadata)

## Integration Notes
- Component is placed AFTER the contact section in LandingExperience
- Uses existing design variables (--gutter, --ivory, --black, etc.)
- Styles match the rest of the site (dark mode, typography, spacing)
- No conflicts with existing pinned sections (process stages section)
