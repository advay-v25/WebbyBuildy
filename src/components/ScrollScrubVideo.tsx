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

let isScrollTriggerSetUp = false;

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

  const lenis = useLenis(() => ScrollTrigger.update());
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const lastFrameRef = useRef(-1);
  const pointerXRef = useRef(0);
  const pointerYRef = useRef(0);
  const currentRotateXRef = useRef(0);
  const currentRotateYRef = useRef(0);

  // Detect reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
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

  // Wait for video metadata
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      console.log("Video metadata loaded, duration:", video.duration);
      video.currentTime = 0;
      setIsVideoReady(true);
    };

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      return () => video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    }
  }, []);

  // Set up ScrollTrigger with cinematic effects
  useGSAP(
    () => {
      if (!isVideoReady || !videoRef.current) return;
      if (isScrollTriggerSetUp) return;

      const video = videoRef.current;
      const container = containerRef.current;
      const videoPanel = videoPanelRef.current;
      const stage = stageRef.current;
      const heading = headingRef.current;
      const letterboxTop = letterboxTopRef.current;
      const letterboxBottom = letterboxBottomRef.current;
      const vignette = vignetteRef.current;
      const grain = grainRef.current;

      if (!container || !videoPanel || !stage) return;

      console.log("Setting up ScrollTrigger with cinematic effects");

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
      gsap.set(video, { opacity: 0 });
      gsap.set(stage, {
        perspective: 1200,
        transformStyle: "preserve-3d"
      });
      gsap.set([letterboxTop, letterboxBottom], { height: 0 });
      gsap.set(vignette, { opacity: 0 });
      gsap.set(grain, { opacity: reducedMotion ? 0 : 0.04 });

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
          scrub: 0.5,
          onUpdate: (self) => {
            const progress = self.progress;

            // ===== VIDEO SCRUBBING (UNCHANGED) =====
            const fadeInProgress = Math.min(progress / 0.08, 1);
            gsap.set(video, { opacity: fadeInProgress });

            const rawTime = progress * VIDEO_DURATION;
            const frameTime = roundToFrame(rawTime);
            const currentFrame = Math.round(frameTime / FRAME_DURATION);
            const lastFrame = lastFrameRef.current;

            if (currentFrame !== lastFrame) {
              video.currentTime = frameTime;
              lastFrameRef.current = currentFrame;
            }

            // ===== CINEMATIC EFFECTS (if not reduced motion) =====
            if (!reducedMotion) {
              // Dolly-in: scale and translateZ
              const dollyProgress = gsap.utils.mapRange(0, 1, 1.12, 1, progress);
              const dollyZ = gsap.utils.mapRange(0, 1, -60, 0, progress);

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
                `
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

      isScrollTriggerSetUp = true;

      return () => {
        tl.kill();
        if (rafId) cancelAnimationFrame(rafId);
        gsap.set([stage, heading, grain], { clearProps: "all" });
        isScrollTriggerSetUp = false;
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
          <h2>From first call to live site</h2>
        </div>

        <div ref={stageRef} className={styles.stage}>
          <video
            ref={videoRef}
            className={styles.videoElement}
            muted
            playsInline
            preload="auto"
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
      </div>
    </section>
  );
}
