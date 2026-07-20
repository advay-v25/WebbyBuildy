# WebbyBuildy Design System

## Color Palette

### Primary Colors
- **Primary:** `#1a1a1a` (Deep Black) — Main text, strong elements
- **Primary Light:** `#2d2d2d` (Charcoal) — Secondary text, borders
- **Accent:** `#c9a96e` (Warm Bronze) — CTAs, highlights, premium accent

### Background Colors
- **Background:** `#ffffff` (White) — Main background
- **Background Secondary:** `#f5f5f5` (Off-white) — Section backgrounds
- **Dark Mode Background:** `#0f0f0f` (Very Dark) — Dark mode support

### Functional Colors
- **Success:** `#2ecc71` (Green)
- **Warning:** `#f39c12` (Orange)
- **Error:** `#e74c3c` (Red)
- **Info:** `#3498db` (Blue)

### Accessibility Notes
- All text on white background meets 4.5:1 contrast minimum
- Bronze accent is used sparingly for CTAs (high contrast)
- Dark mode support for reduced-motion users

## Typography

### Font Stack
```css
/* Headings: Premium serif for brand identity */
font-family: 'Cormorant Garamond', serif;

/* Body: Clean, readable sans-serif */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace: Technical specs, code */
font-family: 'Fira Code', 'Monaco', monospace;
```

### Type Scale
```
H1: 48px / 1.2 line-height (hero titles)
H2: 36px / 1.3 line-height (section titles)
H3: 28px / 1.4 line-height (subsection)
H4: 20px / 1.4 line-height (component titles)
Body: 16px / 1.6 line-height (main content)
Small: 14px / 1.5 line-height (captions, metadata)
```

### Font Weights
- **Headings:** 600 (Cormorant is serif, 400-700 range)
- **Body:** 400 (regular reading)
- **Emphasis:** 600 (bold accent in body)
- **Links:** 500 (slightly heavier than body)

## Spacing System
```
Base unit: 8px
Spacing scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
```

- **Component padding:** 16px-24px
- **Section spacing:** 48px-64px vertical
- **Gap between elements:** 12px-16px

## Component Library

### Buttons
```
Primary: Bronze background, white text, rounded 4px
Secondary: Transparent, bronze border, rounded 4px
Hover: Slightly lighter bronze, subtle lift (2px shadow)
Active: Darker bronze
Disabled: Gray 50%, cursor not-allowed
Transition: 150ms ease-out
```

### Cards
```
Background: White or off-white (#f5f5f5)
Border: 1px solid #e0e0e0
Border-radius: 4px (subtle, not rounded)
Padding: 24px
Shadow: 0 1px 3px rgba(0,0,0,0.1) (subtle depth)
Hover: Slight shadow increase (0 4px 8px rgba(0,0,0,0.15))
Transition: 200ms ease-out
```

### Forms
```
Input border: #d0d0d0
Input focus: Bronze outline, 2px
Placeholder: #999 (readable, not too light)
Label: 14px, #1a1a1a
Error: Red background (light), red text
Success: Green checkmark, green text
```

## Animation System

### Easing Functions
- **Entrance:** `cubic-bezier(0.25, 0.1, 0.25, 1)` (smooth, natural)
- **Interaction:** `cubic-bezier(0.34, 1.56, 0.64, 1)` (spring-like)
- **Exit:** `cubic-bezier(0.7, 0, 0.84, 0)` (smooth fade-out)

### Timing
```
Micro-interactions: 150-200ms (button hover, focus)
Component transitions: 200-300ms (modal, toast)
Page transitions: 300-500ms (layout change)
Scroll animations: 800-1200ms (hero reveal, parallax)
```

### Motion Principles
- **Entrance animations:** Opacity fade + subtle translate (y: -10px)
- **Hover states:** Scale transform (1.02-1.05), shadow shift
- **Scroll animations:** Parallel to scroll (not triggered suddenly)
- **Reduced motion:** All animations disabled when `prefers-reduced-motion` is set

### Animation Components
```tsx
// Fade in on scroll
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

// Button hover
transition: all 150ms cubic-bezier(0.34, 1.56, 0.64, 1);
transform: scale(1.02);
box-shadow: 0 4px 12px rgba(0,0,0,0.15);
```

## Breakpoints
```
Mobile: 320px - 640px
Tablet: 641px - 1024px
Desktop: 1025px - 1440px
Large Desktop: 1441px+
```

## Icons
- **Icon Library:** Lucide-React (already installed)
- **Icon Size:** 16px (small), 24px (default), 32px (large)
- **Icon Stroke:** 1.5-2px for consistency
- **Icon Color:** Inherit text color or use bronze for accent

## DO ✅

- Use generous whitespace (premium feel)
- Smooth, eased animations (no jarring transitions)
- High-quality images/videos (showcase mechanical keyboards)
- Consistent spacing on 8px grid
- Focus states visible for keyboard users
- Respect `prefers-reduced-motion`
- Use serif headings for premium feel
- Subtle shadows for depth (not excessive)

## DON'T ❌

- Bright neon colors (wrong for premium)
- Harsh animations or rapid flashing
- Card soup or excessive nesting
- Gray text on colored backgrounds
- Emoji icons (use Lucide-React)
- Thin fonts < 400 weight on small text
- Auto-playing videos/sound
- Justify text align (hard to read)

## Implementation Checklist

Before shipping any component:
- [ ] Text contrast 4.5:1 minimum (WCAG AA)
- [ ] Hover states have smooth transitions (150-300ms)
- [ ] Focus states visible for keyboard nav
- [ ] Works on 375px, 768px, 1024px, 1440px widths
- [ ] Respects `prefers-reduced-motion`
- [ ] No layout shift on hover/interaction
- [ ] Icons from Lucide-React (not emoji)
- [ ] Spacing follows 8px grid
- [ ] Animation easing uses defined curves (not linear)
