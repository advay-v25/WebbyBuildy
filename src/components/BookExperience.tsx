"use client";

import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CalendarDays, Mail, Moon, Sun, Sunrise } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { CSSProperties, useRef, useState } from "react";
import styles from "@/app/page.module.css";
import { SiteHeader } from "@/components/SiteHeader";
import { CinematicMotionField } from "@/components/CinematicMotionField";
import { CALENDLY_URL } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

// Each window is anchored to an hour. Its position on the wheel is the
// clock-face angle for that hour — (hour % 12) * 30° measured clockwise from
// 12 o'clock: Morning 09:00 → 9 o'clock (left), Afternoon 12:00 → 12 o'clock
// (top), Evening 16:00 → 4 o'clock (lower-right). Badges are fixed anchors:
// hover only changes their highlight, never their position.
const callWindows = [
  { label: "Morning", time: "09:00 — 12:00", hour: 9, icon: Sunrise },
  { label: "Afternoon", time: "12:00 — 16:00", hour: 12, icon: Sun },
  { label: "Evening", time: "16:00 — 19:00", hour: 16, icon: Moon },
] as const;

function windowAngle(hour: number): CSSProperties {
  return { "--angle": `${(hour % 12) * 30}deg` } as CSSProperties;
}

export function BookExperience() {
  const root = useRef<HTMLDivElement>(null);
  const [selectedWindow, setSelectedWindow] = useState(1);

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    gsap.timeline({ defaults: { ease: "expo.out" } })
      .from("[data-book-copy] > *", { opacity: 0, y: 34, duration: .9, stagger: .07 })
      .from("[data-book-aperture]", { opacity: 0, scale: .82, rotate: -14, duration: 1.25 }, .12)
      .from("[data-book-window]", { opacity: 0, stagger: .1, duration: .75 }, .32)
      .from("[data-book-summary]", { opacity: 0, x: 34, rotateY: -7, duration: .9 }, .42);

    gsap.to("[data-book-aperture]", {
      rotate: 20,
      ease: "none",
      scrollTrigger: { trigger: "[data-book-hero]", start: "top top", end: "bottom top", scrub: 1.1 },
    });
  }, { scope: root });

  return (
    <div ref={root} className={`${styles.site} ${styles.bookPage}`}>
      <SiteHeader activeSection="contact" />
      <main id="main-content">
        <section data-book-hero className={styles.bookingScene}>
          <CinematicMotionField variant="booking" />
          <div className={styles.bookingAtmosphere} aria-hidden="true"><i /><i /><i /></div>

          <div data-book-copy className={styles.bookingCopy}>
            <p className={styles.mono}>START A PROJECT</p>
            <h1>Let’s make something<br /><em>people remember</em></h1>
            <p>Pick a window and tell us what you’re building</p>
            <div className={styles.bookingFlow} aria-label="Booking progress">
              <Link href="/#work" className={styles.bookingFlowStep}><b>01</b>Idea</Link>
              <span data-active><b>02</b>Window</span>
              <span><b>03</b>Calendar</span>
            </div>
            <a className={styles.bookingEmail} href="mailto:studio@sitesmith.co.in"><Mail aria-hidden="true" /> Prefer email</a>
          </div>

          <div className={styles.timeChamber}>
            <div data-book-aperture className={styles.apertureRing} aria-hidden="true"><i /><i /><i /><b /></div>
            <div className={styles.windowOrbit} aria-label="Preferred call window">
              {callWindows.map(({ label, time, hour, icon: Icon }, index) => (
                <button
                  key={label}
                  type="button"
                  data-book-window={index}
                  data-active={selectedWindow === index}
                  aria-pressed={selectedWindow === index}
                  style={windowAngle(hour)}
                  onClick={() => setSelectedWindow(index)}
                >
                  <Icon aria-hidden="true" />
                  <span><strong>{label}</strong><small>{time}</small></span>
                </button>
              ))}
            </div>
          </div>

          <motion.aside data-book-summary className={styles.bookingSummary} layout>
            <div className={styles.bookingPanelHead}><span><CalendarDays /> Booking summary</span><small>30 MIN</small></div>
            <AnimatePresence mode="wait">
              <motion.div key={selectedWindow} className={styles.summaryWindow} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <small>Preferred window</small>
                <strong>{callWindows[selectedWindow].label}</strong>
                <span>{callWindows[selectedWindow].time}</span>
              </motion.div>
            </AnimatePresence>
            <dl className={styles.bookingFacts}>
              <div><dt>Meeting</dt><dd>Discovery call</dd></div>
              <div><dt>Format</dt><dd>Zoom</dd></div>
              <div><dt>Next step</dt><dd>Fixed proposal</dd></div>
            </dl>
            <motion.a href={CALENDLY_URL} target="_blank" rel="noreferrer" className={styles.confirmCall} whileHover={{ y: -3 }} whileTap={{ scale: .985 }}>
              Continue to calendar <ArrowUpRight aria-hidden="true" />
            </motion.a>
            <small className={styles.bookingNote}>No commitment and no sales hand-off</small>
          </motion.aside>
        </section>
      </main>
    </div>
  );
}
