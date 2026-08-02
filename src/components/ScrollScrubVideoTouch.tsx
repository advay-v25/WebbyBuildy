"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { useRef, useEffect, useState } from "react";
import styles from "@/components/ScrollScrubVideoTouch.module.css";

gsap.registerPlugin(ScrollTrigger);

const FRAME_DURATION = 1 / 48; // 48fps
const VIDEO_DURATION = 10; // seconds

/**
 * Touch-only scrub video. Written from scratch (not derived from the desktop
 * component) so it carries none of that component's cinematic layers. It does
 * only what a phone needs: pin the panel, map scroll progress to
 * `video.currentTime`, help the mobile decoder along, and fade the final frame
 * out so no frozen "Launch" frame is ever left behind.
 *
 * The desktop path (ScrollScrubVideoDesktop) never renders this and vice versa,
 * so nothing here can reach desktop.
 */
export default function ScrollScrubVideoTouch() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoPanelRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const lastFrameRef = useRef(-1);
  const pendingTimeRef = useRef(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useLenis(() => ScrollTrigger.update());

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    requestAnimationFrame(() => setReducedMotion(mq.matches));
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Actively help the browser decode. iOS Safari and Android Chrome (Data Saver /
  // Low Power) largely ignore preload="auto" and won't fetch frames until a
  // gesture, so prime the decoder once metadata exists and again on first touch.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // play() then immediate pause() forces the browser to decode frames the scrub
    // can seek to. Runs at most once (marked done only on success so a rejected
    // attempt can retry), pausing in BOTH paths so a late-resolving play() can
    // never fight the currentTime assignments. Never calls ScrollTrigger.refresh().
    let primed = false;
    let priming = false;
    const primeDecoder = () => {
      // Only after metadata exists — play() straight after load() rejects with
      // nothing buffered.
      if (primed || priming || video.readyState < 1) return;
      const playPromise = video.play();
      if (playPromise === undefined) {
        video.pause();
        primed = true;
        return;
      }
      priming = true;
      playPromise
        .then(() => { video.pause(); primed = true; priming = false; })
        .catch(() => { video.pause(); priming = false; });
    };

    const handleLoadedMetadata = () => primeDecoder();

    // Correction: if the decoder landed off the intended frame, nudge it back.
    // pendingTimeRef only ever holds a target we actually issued (see onUpdate),
    // so this can never chase a frame the scrub did not ask for.
    const handleSeeked = () => {
      const target = pendingTimeRef.current;
      if (Math.abs(video.currentTime - target) > FRAME_DURATION * 1.5) {
        video.currentTime = target;
        lastFrameRef.current = Math.round(target / FRAME_DURATION);
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("seeked", handleSeeked);
    if (video.readyState >= 1) primeDecoder();

    video.load();

    const handleFirstTouch = () => {
      primeDecoder();
      window.removeEventListener("touchstart", handleFirstTouch);
    };
    window.addEventListener("touchstart", handleFirstTouch, { once: true, passive: true });

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("seeked", handleSeeked);
      window.removeEventListener("touchstart", handleFirstTouch);
    };
  }, []);

  useGSAP(
    () => {
      if (reducedMotion) return;
      const video = videoRef.current;
      const container = containerRef.current;
      const videoPanel = videoPanelRef.current;
      const heading = headingRef.current;
      if (!video || !container || !videoPanel) return;

      const roundToFrame = (seconds: number) =>
        Math.round(seconds / FRAME_DURATION) * FRAME_DURATION;

      gsap.set(video, { opacity: 1 });

      // Created unconditionally on mount (never gated on readiness) so the pin
      // exists even if the video is still loading; readiness only guards the seek.
      const trigger = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        pin: videoPanel,
        scrub: 0.4,
        // Page position 3 of three pinned triggers — refresh last.
        refreshPriority: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          // Fade the video out over the final 5% so the pin never releases onto a
          // frozen last frame ("Launch").
          const fadeOut = gsap.utils.clamp(0, 1, (progress - 0.95) / 0.05);
          gsap.set(video, { opacity: 1 - fadeOut });

          // Fade the heading out between 35% and 50% of progress so it never sits
          // over the video's own closing words (which appear centre-frame from
          // ~53%). Read-only use of progress — the scrub mapping is untouched.
          if (heading) {
            const headingOpacity = 1 - gsap.utils.clamp(0, 1, (progress - 0.35) / 0.15);
            gsap.set(heading, { opacity: headingOpacity });
          }

          const rawTime = Math.min(progress * VIDEO_DURATION, VIDEO_DURATION - FRAME_DURATION);
          const frameTime = roundToFrame(rawTime);
          const currentFrame = Math.round(frameTime / FRAME_DURATION);

          if (currentFrame !== lastFrameRef.current && !video.seeking && video.readyState >= 1) {
            // Record the target ONLY for a seek we actually issue, so the seeked
            // correction handler can never trigger a seek storm.
            pendingTimeRef.current = frameTime;
            video.currentTime = frameTime;
            lastFrameRef.current = currentFrame;
          }
        },
      });

      return () => trigger.kill();
    },
    { scope: containerRef, dependencies: [reducedMotion] }
  );

  // Reduced motion: no pin, no scrub, no 300svh track (which would be a huge
  // empty scroll). Show the video statically, no controls.
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
            {...{ "webkit-playsinline": "true" }}
          >
            <source src="/videos/how-it-works-scrub-portrait.mp4" type="video/mp4" />
          </video>
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className={styles.track}>
      <div ref={videoPanelRef} className={styles.videoPanel}>
        <div className={styles.topScrim} aria-hidden="true" />
        <div ref={headingRef} className={styles.headingOverlay}>
          <p>HOW IT WORKS</p>
          <h2>From <em>first</em> call to <em>live</em> site</h2>
        </div>
        <video
          ref={videoRef}
          className={styles.videoElement}
          muted
          playsInline
          preload="auto"
          poster="/videos/how-it-works-poster.jpg"
          {...{ "webkit-playsinline": "true" }}
        >
          <source src="/videos/how-it-works-scrub-portrait.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
