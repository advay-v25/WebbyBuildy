"use client";

import { useGSAP } from "@gsap/react";
import { animate } from "animejs";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, CalendarDays, Mail, Moon, Sun, Sunrise } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import styles from "@/app/page.module.css";
import { SiteHeader } from "@/components/SiteHeader";
import { CinematicMotionField } from "@/components/CinematicMotionField";
import { CALENDLY_URL } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

const callWindows = [
  { label: "Morning", time: "09:00 — 12:00", icon: Sunrise },
  { label: "Afternoon", time: "12:00 — 16:00", icon: Sun },
  { label: "Evening", time: "16:00 — 19:00", icon: Moon },
] as const;

export function BookExperience() {
  const root = useRef<HTMLDivElement>(null);
  const [selectedWindow, setSelectedWindow] = useState(1);

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    gsap.timeline({ defaults: { ease: "expo.out" } })
      .from("[data-book-copy] > *", { opacity: 0, y: 34, duration: .9, stagger: .07 })
      .from("[data-book-aperture]", { opacity: 0, scale: .82, rotate: -14, duration: 1.25 }, .12)
      .from("[data-book-window]", { opacity: 0, scale: .72, stagger: .1, duration: .75 }, .32)
      .from("[data-book-summary]", { opacity: 0, x: 34, rotateY: -7, duration: .9 }, .42);

    gsap.to("[data-book-aperture]", {
      rotate: 20,
      ease: "none",
      scrollTrigger: { trigger: "[data-book-hero]", start: "top top", end: "bottom top", scrub: 1.1 },
    });
    gsap.from("[data-next-step]", {
      opacity: 0,
      y: 32,
      stagger: .12,
      scrollTrigger: { trigger: "[data-book-next]", start: "top 82%", end: "top 54%", scrub: .7 },
    });
    gsap.fromTo("[data-book-signal]", { scaleX: 0 }, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { trigger: "[data-book-next]", start: "top 90%", end: "bottom 58%", scrub: .8 },
    });
  }, { scope: root });

  const chooseWindow = (index: number) => {
    setSelectedWindow(index);
    animate(`[data-book-window="${index}"]`, {
      scale: [1, .94, 1.04, 1],
      duration: 620,
      ease: "outExpo",
    });
  };

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
              {["Idea", "Window", "Calendar"].map((label, index) => (
                <span key={label} data-active={index === 1}><b>0{index + 1}</b>{label}</span>
              ))}
            </div>
            <a className={styles.bookingEmail} href="mailto:aaravaher25@gmail.com"><Mail aria-hidden="true" /> Prefer email</a>
          </div>

          <div className={styles.timeChamber}>
            <div data-book-aperture className={styles.apertureRing} aria-hidden="true"><i /><i /><i /><b /></div>
            <div className={styles.windowOrbit} aria-label="Preferred call window">
              {callWindows.map(({ label, time, icon: Icon }, index) => (
                <motion.button
                  key={label}
                  data-book-window={index}
                  data-active={selectedWindow === index}
                  aria-pressed={selectedWindow === index}
                  onClick={() => chooseWindow(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: .96 }}
                >
                  <Icon aria-hidden="true" />
                  <span><strong>{label}</strong><small>{time}</small></span>
                </motion.button>
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
              <div><dt>Format</dt><dd>Google Meet</dd></div>
              <div><dt>Next step</dt><dd>Fixed proposal</dd></div>
            </dl>
            <motion.a href={CALENDLY_URL} target="_blank" rel="noreferrer" className={styles.confirmCall} whileHover={{ y: -3 }} whileTap={{ scale: .985 }}>
              Continue to calendar <ArrowUpRight aria-hidden="true" />
            </motion.a>
            <small className={styles.bookingNote}>No commitment and no sales hand-off</small>
          </motion.aside>
          <a href="#what-happens-next" className={styles.bookingScrollCue}>What happens next <ArrowDownRight /></a>
        </section>

        <section id="what-happens-next" data-book-next className={styles.bookingNext}>
          <CinematicMotionField variant="finale" />
          <span data-book-signal className={styles.bookingNextSignal} aria-hidden="true" />
          <div data-next-step className={styles.bookingNextHeading}><p className={styles.mono}>AFTER YOU BOOK</p><h2>What happens next</h2></div>
          {[
            ["01", "We prepare", "We review your context and arrive ready"],
            ["02", "We connect", "A focused conversation that moves things forward"],
            ["03", "We build", "A clear path from idea to impact"],
          ].map(([number, title, copy]) => (
            <article data-next-step key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>
          ))}
          <div data-next-step className={styles.bookingDirect}>
            <h2>Prefer to write first</h2>
            <a href="mailto:aaravaher25@gmail.com">aaravaher25@gmail.com <ArrowUpRight /></a>
          </div>
        </section>
      </main>
    </div>
  );
}
