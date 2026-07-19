"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CalendarDays, Clock3, Mail, Phone } from "lucide-react";
import { useState } from "react";
import styles from "@/app/page.module.css";
import { SiteHeader } from "@/components/SiteHeader";
import { CALENDLY_URL } from "@/lib/constants";

const callWindows = [
  ["Morning", "09:00 — 12:00"],
  ["Afternoon", "12:00 — 16:00"],
  ["Evening", "16:00 — 19:00"],
] as const;

export function BookExperience() {
  const [selectedWindow, setSelectedWindow] = useState(1);

  return (
    <div className={`${styles.site} ${styles.bookPage}`}>
      <SiteHeader activeSection="contact" />
      <main className={styles.bookingScene}>
        <div className={styles.bookingAtmosphere} aria-hidden="true"><i /><i /><i /></div>
        <section className={styles.bookingCopy}>
          <motion.h1 initial={{ opacity: 0, y: 44 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease: [.16, 1, .3, 1] }}>
            Let’s make something<br /><em>impossible to ignore.</em>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .14, duration: .65 }}>
            A focused 30-minute call. No pitch. Just your idea, the audience, and what the site needs to do.
          </motion.p>
          <div className={styles.bookingContacts}>
            <a href="mailto:aaravaher25@gmail.com"><Mail aria-hidden="true" /><span><small>Email</small>aaravaher25@gmail.com</span></a>
            <a href="tel:+919619011111"><Phone aria-hidden="true" /><span><small>Phone</small>+91 96190 11111</span></a>
          </div>
          <div className={styles.bookingFlow} aria-label="Project start flow">
            {["Idea", "Call", "Proposal"].map((label, index) => <span key={label} data-active={index === 1}><b>0{index + 1}</b>{label}</span>)}
          </div>
        </section>

        <motion.section className={styles.bookingChamber} initial={{ opacity: 0, scale: .9, rotateY: 8 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} transition={{ delay: .1, type: "spring", stiffness: 110, damping: 22 }}>
          <div className={styles.apertureRing} aria-hidden="true"><i /><i /><i /><b /></div>
          <div className={styles.bookingPanel}>
            <div className={styles.bookingPanelHead}><span><CalendarDays /> Plan the call</span><small>30 MIN · GOOGLE MEET</small></div>
            <h2>Choose a call window</h2>
            <p>Pick the part of the day that usually works best. Calendly will show the exact live slots.</p>
            <div className={styles.callWindows}>
              {callWindows.map(([label, time], index) => (
                <motion.button key={label} data-active={selectedWindow === index} onClick={() => setSelectedWindow(index)} whileTap={{ scale: .98 }}>
                  <Clock3 aria-hidden="true" /><span><strong>{label}</strong><small>{time}</small></span>
                </motion.button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={selectedWindow} className={styles.selectedWindow} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                Preferred window · <strong>{callWindows[selectedWindow][0]}</strong>
              </motion.div>
            </AnimatePresence>
            <motion.a href={CALENDLY_URL} target="_blank" rel="noreferrer" className={styles.confirmCall} whileHover={{ y: -3 }} whileTap={{ scale: .985 }}>
              See live availability <ArrowUpRight aria-hidden="true" />
            </motion.a>
            <small className={styles.bookingNote}>No commitment. You’ll receive a fixed proposal after the call.</small>
          </div>
        </motion.section>
        <div className={styles.bookingSignal} aria-hidden="true"><i /></div>
      </main>
    </div>
  );
}
