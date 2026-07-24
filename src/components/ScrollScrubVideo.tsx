"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { useRef, useEffect, useState } from "react";
import styles from "@/components/ScrollScrubVideo.module.css";

gsap.registerPlugin(ScrollTrigger);

const FRAME_DURATION = 1 / 24; // 24fps
const VIDEO_DURATION = 10; // seconds

export default function ScrollScrubVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoPanelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const letterboxTopRef = useRef<HTMLDivElement>(null);
  const letterboxBottomRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const processExitRef = useRef<HTMLDivElement>(null);

  useLenis(() => ScrollTrigger.update());
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const lastFrameRef = useRef(-1);
  const pendingTimeRef = useRef(0);
  const pointerXRef = useRef(0);
  const pointerYRef = useRef(0);
  const currentRotateXRef = useRef(0);
  const currentRotateYRef = useRef(0);

  // Detect reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    requestAnimationFrame(() => setReducedMotion(mediaQuery.matches));
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Detect touch device
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsTouchDevice(
        window.matchMedia("(hover: none) and (pointer: coarse)").matches
      );
    });
  }, []);

  // Cursor parallax (desktop only)
  useEffect(() => {
    if (isTouchDevice || reducedMotion || !stageRef.current) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      pointerXRef.current = x * 1.5;
      pointerYRef.current = y * -1.5;
    };

    const stage = stageRef.current;
    stage?.addEventListener("pointermove", handlePointerMove);
    return () => stage?.removeEventListener("pointermove", handlePointerMove);
  }, [isTouchDevice, reducedMotion]);

  // Wait for the first decoded frame so the poster never flashes to black
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      video.currentTime = 0;
      setIsVideoReady(true);
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    const handleSeeked = () => {
      const target = pendingTimeRef.current;
      if (Math.abs(video.currentTime - target) > FRAME_DURATION * 1.5) {
        video.currentTime = target;
        lastFrameRef.current = Math.round(target / FRAME_DURATION);
      }
    };

    video.addEventListener("seeked", handleSeeked);

    if (video.readyState >= 2) {
      handleLoadedData();
    } else {
      video.addEventListener("loadeddata", handleLoadedData);
    }

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, []);

  // Set up ScrollTrigger with cinematic effects
  useGSAP(
    () => {
      if (!isVideoReady || !videoRef.current) return;

      const video = videoRef.current;
      const container = containerRef.current;
      const videoPanel = videoPanelRef.current;
      const stage = stageRef.current;
      const heading = headingRef.current;
      const letterboxTop = letterboxTopRef.current;
      const letterboxBottom = letterboxBottomRef.current;
      const vignette = vignetteRef.current;
      const grain = grainRef.current;
      const processExit = processExitRef.current;

      if (!container || !videoPanel || !stage) return;

      const roundToFrame = (seconds: number): number => {
        return Math.round(seconds / FRAME_DURATION) * FRAME_DURATION;
      };

      // Kill any existing trigger
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === container) {
          trigger.kill();
        }
      });

      // Set initial states
      gsap.set(video, { opacity: 0.14 });
      gsap.set(stage, {
        perspective: 1200,
        transformStyle: "preserve-3d"
      });
      gsap.set([letterboxTop, letterboxBottom], { height: 0 });
      gsap.set(vignette, { opacity: 0 });
      gsap.set(grain, { opacity: reducedMotion ? 0 : 0.04 });
      gsap.set(processExit, { opacity: 0, y: 24 });

      // Grain animation (subtle drift)
      if (grain && !reducedMotion) {
        gsap.to(grain, {
          backgroundPosition: "200% 200%",
          duration: 12,
          repeat: -1,
          ease: "none"
        });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          pin: videoPanel,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            // ===== VIDEO SCRUBBING (UNCHANGED) =====
            const fadeInProgress = 0.14 + Math.min(progress / 0.08, 1) * 0.86;
            gsap.set(video, { opacity: fadeInProgress });

            const rawTime = Math.min(progress * VIDEO_DURATION, VIDEO_DURATION - FRAME_DURATION);
            const frameTime = roundToFrame(rawTime);
            const currentFrame = Math.round(frameTime / FRAME_DURATION);
            const lastFrame = lastFrameRef.current;
            pendingTimeRef.current = frameTime;

            if (currentFrame !== lastFrame && !video.seeking) {
              video.currentTime = frameTime;
              lastFrameRef.current = currentFrame;
            }

            // ===== CINEMATIC EFFECTS (if not reduced motion) =====
            if (!reducedMotion) {
              const entry = Math.min(progress / .14, 1);
              const exit = Math.max((progress - .86) / .14, 0);
              const dollyProgress = .84 + entry * .16 - exit * .08;
              const dollyZ = -80 + entry * 80 - exit * 45;
              const frameRadius = (1 - entry) * 34 + exit * 38;

              // Subtle rotation: tilt in and out
              const tiltX = gsap.utils.mapRange(0, 1, 2.5, 0, progress);
              const tiltY = gsap.utils.mapRange(0, 1, -1.5, 0, progress);

              // Compose with cursor parallax
              const finalRotateX = tiltX + currentRotateXRef.current;
              const finalRotateY = tiltY + currentRotateYRef.current;

              gsap.set(stage, {
                transform: `
                  perspective(1200px)
                  scale(${dollyProgress})
                  translateZ(${dollyZ}px)
                  rotateX(${finalRotateX}deg)
                  rotateY(${finalRotateY}deg)
                `,
                borderRadius: `${frameRadius}px`,
              });

              // Letterbox animation: fade in top/bottom over first/last 10%
              const letterboxInProgress = Math.min(progress / 0.1, 1);
              const letterboxOutProgress = Math.max((progress - 0.9) / 0.1, 0);
              const letterboxHeight = 6 * Math.max(letterboxInProgress, letterboxOutProgress);

              if (letterboxTop) gsap.set(letterboxTop, { height: `${letterboxHeight}vh` });
              if (letterboxBottom) gsap.set(letterboxBottom, { height: `${letterboxHeight}vh` });

              // Vignette: gradually strengthen over the pin
              const vignetteOpacity = 0.3 + progress * 0.25;
              if (vignette) gsap.set(vignette, { opacity: vignetteOpacity });

              // Heading animation: reveal on entry, recede after ~15%
              if (heading) {
                const headingRecedeProgress = Math.max((progress - 0.15) / 0.25, 0);

                const headingOpacity = 1 - headingRecedeProgress;
                const headingZ = -120 * headingRecedeProgress;
                const headingBlur = 4 * headingRecedeProgress;

                gsap.set(heading, {
                  opacity: headingOpacity,
                  transform: `translateZ(${headingZ}px)`,
                  filter: `blur(${headingBlur}px)`
                });
              }

              if (processExit) {
                gsap.set(processExit, {
                  opacity: gsap.utils.clamp(0, 1, (progress - .88) / .08),
                  y: gsap.utils.mapRange(.88, 1, 24, 0, progress),
                });
              }
            }
          },
        },
      });

      // Animate a dummy object just to keep the timeline active
      tl.to({}, { duration: 1 });

      // Cursor parallax update loop (desktop only)
      let rafId: number;
      if (!isTouchDevice && !reducedMotion && stage) {
        const updateParallax = () => {
          const dampingFactor = 0.15;
          currentRotateXRef.current += (pointerYRef.current - currentRotateXRef.current) * dampingFactor;
          currentRotateYRef.current += (pointerXRef.current - currentRotateYRef.current) * dampingFactor;
          rafId = requestAnimationFrame(updateParallax);
        };
        rafId = requestAnimationFrame(updateParallax);
      }

      return () => {
        tl.kill();
        if (rafId) cancelAnimationFrame(rafId);
        gsap.set([stage, heading, grain], { clearProps: "all" });
      };
    },
    { scope: containerRef, dependencies: [isVideoReady, reducedMotion, isTouchDevice] }
  );

  if (reducedMotion) {
    return (
      <section className={styles.sectionReducedMotion}>
        <div className={styles.videoContainerReducedMotion}>
          <video
            ref={videoRef}
            className={styles.videoElement}
            muted
            playsInline
            preload="auto"
            poster="/videos/how-it-works-poster.jpg"
            controls
          >
            <source src="/videos/how-it-works-scrub.mp4" type="video/mp4" />
          </video>
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className={styles.track}>
      <div data-video-panel ref={videoPanelRef} className={styles.videoPanel}>
        <div ref={headingRef} className={styles.headingOverlay}>
          <p>HOW IT WORKS</p>
          <h2>From <em>first</em> call to <em>live</em> site</h2>
        </div>

        <div ref={stageRef} className={styles.stage}>
          <video
            ref={videoRef}
            className={styles.videoElement}
            muted
            playsInline
            preload="auto"
            poster="/videos/how-it-works-poster.jpg"
          >
            <source src="/videos/how-it-works-scrub.mp4" type="video/mp4" />
          </video>

          {!isVideoReady && <div className={styles.loadingPlaceholder} />}

          {/* Vignette overlay */}
          <div ref={vignetteRef} className={styles.vignette} />

          {/* Film grain */}
          <div ref={grainRef} className={styles.grain} />
        </div>

        {/* Letterbox bars */}
        <div ref={letterboxTopRef} className={styles.letterboxTop} />
        <div ref={letterboxBottomRef} className={styles.letterboxBottom} />

        {/* Gradient fades (from cosmetic fixes) */}
        <div className={styles.gradientTop} />
        <div className={styles.gradientBottom} />

        <div ref={processExitRef} className={styles.processExit}>
        </div>
      </div>
    </section>
  );
}
