# WebbyBuildy cinematic design system

**Direction:** restrained cinematic editorial studio
**Updated:** 2026-07-21

## Core palette

| Role | Value |
|---|---|
| Canvas | `#050506` |
| Elevated canvas | `#0A0A0C` |
| Warm ivory | `#F3EFE8` |
| Muted copy | `#A7A19A` |
| Vermilion signal | `#E1382D` |
| Bright signal | `#FF493D` |
| Hairline | `rgba(255,255,255,.12)` |
| Glass | `rgba(14,14,14,.72)` |

Red is a signal, not a fill. Use it for the active edge, a cursor light, a progress line, or one selected control. Never wash an entire page in red.

## Typography

- Display sans: Space Grotesk, weight 500–650, tight tracking
- Body: Archivo, weight 400–500
- Technical labels: IBM Plex Mono, uppercase, 0.12–0.16em tracking
- Editorial accent: Georgia italic, only for one emotionally important phrase per chapter
- Headings and titles never end in a full stop
- Use sentence case and keep headings short enough to scan in one glance

## Spatial language

- Full-width chapters with generous negative space
- One dominant visual object per viewport
- 20–28px corner radii on large glass planes; 12–16px on controls
- Hairline borders and realistic inner highlights instead of heavy outlines
- Preserve open bands and asymmetric editorial composition; avoid bento grids

## Motion language

- One primary motion beat per section; supporting layers move at 5–12% of that amplitude
- Reveal travel: 12–28px; duration 600–900ms; `cubic-bezier(.16,1,.3,1)`
- Scroll scrub: 0.7–1.2 smoothing; pin only the hero and film process chapter
- Parallax is decorative and remains under 12% displacement
- Hover depth is 2–8px with a small perspective tilt; never cause layout shift
- Keyboard pieces fall with gravity and individually varied timing; never leave in batches
- Respect `prefers-reduced-motion` by removing pinning, scrub, parallax, and 3D transforms

## Components

- Header: one shared smoked-glass rail across every route
- Primary CTA: dark liquid glass with a narrow red lower-edge signal
- Cards: physically layered smoked glass, quiet inactive states, one clearly active plane
- Orbit controls: 44px minimum hit target, visible label and focus ring
- Forms and booking controls: persistent labels, explicit selection state, clear next action

## Section order

1. ESC pullback hero
2. Built to be used / Designed to be felt transition
3. Work carousel
4. One continuous system
5. Process film
6. Founders installation
7. Final invitation

## Do not use

- Giant red plates, generic AI gradients, neon cyberpunk, fake statistics, excessive pills
- Simultaneous animation of every layer
- Random generated text inside imagery where UI text should be real HTML
- Low-contrast labels, invisible focus states, autoplay audio, or interaction-only content
- Full stops at the end of headers and titles

## Delivery checks

- Keyboard and video geometry match at every crossfade
- Space entry stops on the transition chapter and waits for the next user scroll
- All controls work by keyboard and have visible focus
- 375px, 768px, 1024px, and 1440px layouts remain free of horizontal overflow
- Video posters prevent blank frames and later media uses deferred loading
- Reduced-motion mode keeps all content readable and reachable
