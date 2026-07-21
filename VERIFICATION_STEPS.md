# Quick Verification Steps

## Before Testing
1. All files saved
2. No TypeScript errors: `pnpm run typecheck`
3. Build succeeds: `pnpm run build`
4. Video file exists: `ls -l public/videos/how-it-works-scrub.mp4`

## Quick Test (2 minutes)

### Start Dev Server
```bash
pnpm run dev
# Navigate to http://localhost:3000
```

### Visual Check
1. **Page loads** → No console errors about ScrollTrigger or video
2. **Scroll down** → See "Work that earns attention", "From a spark", capability nodes
3. **Continue scrolling** → See the "How it works" section with video panel
4. **Check heading** → "HOW IT WORKS" above video, "From first call to live site" subtitle
5. **Video visible** → Black video area fills viewport

### Interaction Check
1. **Scroll slowly down** → Video advances frame by frame (look at video content)
2. **Scroll up** → Video rewinds
3. **Stop scrolling** → Video freezes on current frame (no flicker, no blinking)
4. **Fast scroll** → Video follows smoothly (not jumpy)
5. **At end** → Continue scrolling down → Page continues to founders section
6. **From top** → Continue scrolling up → Page continues above to capabilities

### Console Check
Open DevTools Console (F12 → Console tab)
- Look for: `"Video metadata loaded, duration: 10"`
- Look for: `"Setting up ScrollTrigger for video scrubbing"`
- Look for progress logs like: `"Progress: 0.123, Time: 1.200s, Frame: 28"`
- No errors or warnings

## Mobile Test (Optional)

### With Browser DevTools Mobile Emulation
1. F12 → Device Emulation
2. Select "iPhone 12" or similar
3. Repeat interaction checks
4. Watch performance: should still be smooth
5. Note: Track height is 300vh instead of 500vh on mobile

## Reduced Motion Test

### Emulate Reduced Motion
1. F12 → Rendering → Emulate CSS media feature prefers-reduced-motion: reduce
2. Reload page
3. Video section should NOT be pinned
4. Video should render with play/pause controls
5. Scroll through → page scrolls normally (no pinning)

## Expected Behavior Summary

| State | Behavior |
|-------|----------|
| **Metadata Loading** | Video shows loading placeholder (pulsing) |
| **First Frame** | Black background (or video first frame) |
| **Slow Scroll Down** | Each scroll increment advances 1-2 frames |
| **Fast Scroll Down** | Video accelerates through frames smoothly |
| **At Mid-Video** | Stopping scroll holds a steady frame (no blink) |
| **Near End** | Last few frames visible as scroll progresses |
| **Past End** | Page releases and continues scrolling |
| **Scroll Up** | Video rewinds frame by frame |
| **Before Start** | Page releases upward |
| **Reduced Motion** | Video renders without pinning, has controls |
| **Mobile (300vh)** | Same behavior but shorter track |

## Console Messages Sequence

When scrolling into the video section, you should see:

```
Video metadata loaded, duration: 10
Setting up ScrollTrigger for video scrubbing
Progress: 0.000, Time: 0.000s, Frame: 0
Progress: 0.050, Time: 0.500s, Frame: 12
Progress: 0.100, Time: 1.000s, Frame: 24
Progress: 0.150, Time: 1.500s, Frame: 36
...
Progress: 1.000, Time: 10.000s, Frame: 240
```

Frame numbers should increment smoothly without large jumps.

## What NOT to Expect

❌ **Autoplay** - Video should NOT play automatically when entering section  
❌ **Looping** - Video should NOT loop continuously  
❌ **Play Button** - Normal mode should NOT have play/pause controls  
❌ **Audio** - Video has no audio (intentionally stripped)  
❌ **Jerky Playback** - Should NOT see stuttering or frame skips  
❌ **Blinking** - Video should NOT flicker or blink  
❌ **Multiple Rewinds** - Should NOT see video jumping around  

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Video doesn't load | File path wrong or CORS issue | Check `public/videos/how-it-works-scrub.mp4` exists |
| No pinning, page scrolls through | ScrollTrigger not initializing | Check console for "Setting up ScrollTrigger" message |
| Video flickers/blinks | Seek-thrash (too many seeks) | Check lastFrame tracking in component |
| Scrolling doesn't advance video | Progress not updating | Check `onUpdate` callback fires in console logs |
| Video jumps around | Corrupted video file | Re-encode or verify file with ffprobe |
| Mobile slow | Too many seeks | Should be OK on 300vh track |
| Reduced motion still pins | CSS media query not working | Check browser support for prefers-reduced-motion |

## Files Modified Summary

### Deleted
- Process section (Talk/Proposal/Build/Launch dials)
- ScrollScrubVideo component from end of page

### Created/Updated
- `src/components/ScrollScrubVideo.tsx` - Video scrubbing component
- `src/components/ScrollScrubVideo.module.css` - Component styles
- `src/components/LandingExperience.tsx` - Removed process section, added video
- `src/app/page.module.css` - Updated styles for new section structure
- `DEBUGGING_AND_FIXES.md` - This document

### Video Asset
- `public/videos/how-it-works-scrub.mp4` - 1920×1080, 24fps, 10s, keyframe-encoded

---

**Ready to test?** Run `pnpm run dev` and scroll to the "How it works" section!
