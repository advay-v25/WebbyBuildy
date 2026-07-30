"use client";

import { ReactNode, useState } from "react";
import { ReactLenis } from "lenis/react";

export function LenisProvider({ children }: { children: ReactNode }) {
  // `syncTouch` makes Lenis intercept touch gestures and synthesize its own
  // scrolling. On touch devices that swallows nested horizontal swipes (the
  // work rail, the founder grid) and can stop ScrollTrigger pins from firing.
  // Enable it only where there is no touch input (desktop / fine pointer); on
  // coarse-pointer devices fall back to native touch scrolling + momentum.
  // Desktop is unaffected — it has no touch input, so syncTouch stays true and
  // `lerp: 0.08` is unchanged. Detected once on mount; a device's pointer type
  // does not change, and ReactLenis re-inits when the options object changes.
  const [syncTouch] = useState(() =>
    typeof window !== "undefined"
      ? !window.matchMedia("(hover: none) and (pointer: coarse)").matches
      : true,
  );

  return (
    <ReactLenis root options={{ lerp: 0.08, syncTouch }}>
      {children}
    </ReactLenis>
  );
}
