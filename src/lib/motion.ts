import type { Transition, Variants } from "framer-motion";

/**
 * Shared Framer Motion presets for Sitesmith.
 *
 * These aren't invented values — they're extracted from the easing/spring
 * numbers already proven out across LandingExperience, BookExperience, and
 * StudioExperience (project cards, system nodes, booking chamber, founder
 * panels), plus the site's CSS --ease token. Reach for these in Phase 2/3
 * work instead of hand-picking new stiffness/damping numbers, so motion
 * stays consistent site-wide.
 */

/** Matches the CSS `--ease` custom property in page.module.css and the
 * Book page headline entrance — the site's signature "settle in" curve. */
export const EASE_SIGNATURE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Springs, named by where they're already used. */
export const springs = {
  /** Interactive cards that need weight — project rail, deck items. */
  panel: { type: "spring", stiffness: 145, damping: 24, mass: 1.05 } satisfies Transition,
  /** Selectable nodes/steps (system capabilities, process steps) — snappier, no mass tweak. */
  node: { type: "spring", stiffness: 190, damping: 22 } satisfies Transition,
  /** Larger surfaces entering the scene (booking chamber, modals). */
  soft: { type: "spring", stiffness: 110, damping: 22 } satisfies Transition,
  /** Shared-layout transitions (founder panel `layout` prop). */
  layout: { type: "spring", stiffness: 150, damping: 24 } satisfies Transition,
} as const;

/** Duration-based transitions using the signature ease, for non-spring cases. */
export const durations = {
  fast: { duration: 0.2, ease: EASE_SIGNATURE } satisfies Transition,
  base: { duration: 0.34, ease: EASE_SIGNATURE } satisfies Transition,
  slow: { duration: 0.65, ease: EASE_SIGNATURE } satisfies Transition,
} as const;

/** Fade up on enter — the most common reveal across the site (headlines, copy blocks). */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: durations.slow },
};

/** Plain fade, for elements where vertical motion would fight a parent transform. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: durations.base },
};

/** Blur + fade — matches the capabilityDisplay panel swap in LandingExperience. */
export const blurIn: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: durations.base },
  exit: { opacity: 0, y: -12, filter: "blur(6px)", transition: durations.fast },
};

/** Wrap a list with this, give each item `fadeUp`, and children stagger automatically. */
export const staggerContainer = (staggerChildren = 0.08): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren } },
});

/** Hover/tap pair for interactive cards — matches the project-rail and founder-panel lift. */
export const cardInteraction = {
  whileHover: { y: -10, scale: 1.015 },
  whileTap: { scale: 0.985 },
  transition: springs.panel,
} as const;
