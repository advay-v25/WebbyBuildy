# WebbyBuildy Library & Skill Integration

All reference repositories have been cloned to `.references/` and documented in Claude Code memory for future sessions.

## What's Installed ✅

### Animation Libraries (npm packages)
- **GSAP** (`gsap@^3.15.0` + `@gsap/react`) — Scroll-driven animations with ScrollTrigger
- **Framer Motion** (`framer-motion@^12.42.2`) — React gesture + spring animations
- **Lenis** (`lenis@^1.3.25`) — Smooth scrolling with WebGL/parallax sync
- **Anime.js** (`animejs@^4.5.0`) — Lightweight tweens and property animations

### Design & Code Quality Skills
- **Impeccable** — 23 design commands for professional UI (`/impeccable init` to start)
- **Taste Skill** — Anti-slop frontend patterns (prevents AI template defaults)
- **UI/UX Pro Max** — AI design system generator (161 reasoning rules, 84 UI styles)
- **Caveman** — Terse output for Claude Code (65% fewer tokens per response)

## Reference Materials 📚

All learning repos are cloned and available locally:
- `.references/lenis/` — Smooth scrolling patterns
- `.references/GSAP/` — Animation library docs
- `.references/framer-motion/` — React gesture examples
- `.references/ui-ux-pro-max-skill/` — Design system generation
- `.references/impeccable/` — Design commands & examples
- `.references/taste-skill/` — Anti-pattern solutions
- `.references/caveman/` — Terse output setup

## Quick Start for New Features

### 1. Plan the UI/UX
```bash
/impeccable shape    # Plan before coding
```

### 2. Choose your animation approach
| Need | Use | When |
|------|-----|------|
| Scroll reveal | GSAP ScrollTrigger | Complex sequences, precise timing |
| Button hover | Framer Motion | Micro-interactions, gestures |
| Parallax | GSAP + Lenis | Scroll-synced effects |
| Simple tween | Anime | Loading states, counters |

### 3. Build with design patterns
- Check `DESIGN.md` for colors, typography, spacing
- Use Lucide-React for icons (not emoji)
- Respect `prefers-reduced-motion`
- Aim for 4.5:1 text contrast minimum

### 4. Quality check before shipping
```bash
/impeccable audit    # a11y, responsive, performance
/impeccable polish   # Final refinement
```

## Code Snippets

### GSAP ScrollTrigger (Scroll-driven)
```tsx
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Section() {
  useGSAP(() => {
    gsap.to('.box', {
      scrollTrigger: { trigger: '.box', start: 'top center' },
      duration: 1,
      y: -100,
    });
  }, { revertOnUnmount: true });
  
  return <div className="box">Content</div>;
}
```

### Framer Motion (Gesture + Spring)
```tsx
import { motion } from 'framer-motion';

export function Button() {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400 }}
    >
      Interactive Button
    </motion.button>
  );
}
```

### Lenis (Smooth Scroll)
```tsx
import { useEffect } from 'react';
import Lenis from 'lenis';

export function RootLayout({ children }) {
  useEffect(() => {
    const lenis = new Lenis();
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);
  
  return <>{children}</>;
}
```

## Anti-Patterns to Avoid ❌

- Purple-to-blue gradients (generic AI default)
- Nested cards-in-cards (bad UX)
- Gray text on colored backgrounds (contrast fail)
- Emoji icons (use Lucide-React instead)
- Harsh animations without easing
- Ignoring `prefers-reduced-motion`

## Memory & Future Sessions

All information is saved in Claude Code memory at:
- `.claude/projects/-Users-AaravAher-Webby-WebbyBuildy/memory/`

Future Claude Code sessions will have full context about:
- Which libraries to use when
- Design patterns and anti-patterns
- Impeccable commands for design workflow
- Integration code examples
- Reference material locations

## Next Steps

1. Run `/impeccable init` to set up design context (one-time)
2. Create components using the animation library that fits
3. Use `/impeccable shape` for new UI sections
4. Run `/impeccable audit` before merging
5. See `DESIGN.md` for color/typography tokens (once generated)
