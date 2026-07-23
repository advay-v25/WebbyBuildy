"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import siteStyles from "@/app/page.module.css";
import styles from "./team.module.css";
import { SiteHeader } from "@/components/SiteHeader";

type Founder = {
  first: string;
  last: string;
  discipline: string;
  role: string;
  email: string;
  phone: string;
  bio: [string, string, string];
};

// Each founder keeps their personal email and phone on this page.
const founders: Founder[] = [
  {
    first: "Aarav",
    last: "Aher",
    discipline: "Business",
    role: "International Business at Northeastern",
    email: "aaravaher25@gmail.com",
    phone: "+91 98202 36834",
    bio: [
      "I'm studying International Business at Northeastern, but I've always been the one who needs to know how things work underneath, so I taught myself to build them.",
      "The three of us design and build every site together, start to finish, with no handing pieces off to each other.",
      "I care most about the small details other people tend to skip.",
    ],
  },
  {
    first: "Abhimanyu",
    last: "Gupta",
    discipline: "Aviation",
    role: "Cadet with IndiGo",
    email: "abhimanyuwings12@gmail.com",
    phone: "+91 98205 20800",
    bio: [
      "I'm an aspiring commercial pilot, and I've cleared all my license exams here in India. Aviation has been my passion for as long as I can remember.",
      "Away from flying you'll find me reading, playing the guitar, or on the field for just about any sport.",
      "I've always wanted to build things people actually use, and Sitesmith lets me do exactly that.",
    ],
  },
  {
    first: "Advay",
    last: "Vaidya",
    discipline: "Finance",
    role: "CFA aspirant",
    email: "advayvaidya.2007@gmail.com",
    phone: "+91 96190 11111",
    bio: [
      "I'm 19, and I move between spreadsheets and source code, one day deep in CFA Level 1 prep, the next building a systematic trading framework for Indian markets.",
      "I treat most things, from a workout split to a stock screener, as a system worth taking apart and rebuilding better.",
      "No formal coding background, just a self-taught streak I've used to build AI tools across fintech, real estate, and personal strategy.",
    ],
  },
];

const isPlaceholder = (value: string) => value.startsWith("[PLACEHOLDER");

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const rise = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const card = {
  hidden: { opacity: 0, y: 48, rotateY: -10 },
  show: { opacity: 1, y: 0, rotateY: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function TeamPage() {
  const router = useRouter();

  // Prefer returning to the exact page the user came from (the /studio
  // "Three paths" page, where "Meet the studio" lives); fall back to /studio
  // for direct/deep-link visits with no history to go back to.
  const handleBack = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.history.length > 1) {
      event.preventDefault();
      router.back();
    }
  };

  return (
    <div className={siteStyles.site}>
      <SiteHeader activeSection="founders" />

      <main id="main-content" className={styles.page}>
        <motion.section
          className={styles.intro}
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={rise}>
            <Link href="/studio" onClick={handleBack} className={styles.backLink}>
              <ArrowLeft size={15} /> Back to studio
            </Link>
          </motion.div>
          <motion.p className={styles.eyebrow} variants={rise}>
            FOUNDERS / TEAM
          </motion.p>
          <motion.h1 variants={rise}>
            The people<br />behind the <span>pixels</span>
          </motion.h1>
          <motion.p className={styles.lead} variants={rise}>
            Three friends from Mumbai. You talk to them directly — no account
            managers, no hand-offs, no agency drag.
          </motion.p>
        </motion.section>

        <motion.section
          className={styles.grid}
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {founders.map((founder) => (
            <motion.article
              key={`${founder.first}-${founder.last}`}
              className={styles.card}
              variants={card}
              whileHover={{ y: -12, transition: { type: "spring", stiffness: 260, damping: 24 } }}
            >
              <div className={styles.cardTop}>
                <span className={styles.discipline}>{founder.discipline}</span>
                <h2>
                  {founder.first}
                  <br />
                  {founder.last}
                </h2>
                <p className={styles.role}>{founder.role}</p>
              </div>

              <ul className={styles.bio}>
                {founder.bio.map((line, i) => (
                  <li key={i} className={isPlaceholder(line) ? styles.placeholder : undefined}>
                    {line}
                  </li>
                ))}
              </ul>

              <div className={styles.contacts}>
                {isPlaceholder(founder.email) ? (
                  <span className={`${styles.contact} ${styles.placeholder}`}>
                    <Mail size={15} /> {founder.email}
                  </span>
                ) : (
                  <a className={styles.contact} href={`mailto:${founder.email}`}>
                    <Mail size={15} /> {founder.email}
                  </a>
                )}
                {isPlaceholder(founder.phone) ? (
                  <span className={`${styles.contact} ${styles.placeholder}`}>
                    <Phone size={15} /> {founder.phone}
                  </span>
                ) : (
                  <a className={styles.contact} href={`tel:${founder.phone.replace(/\s+/g, "")}`}>
                    <Phone size={15} /> {founder.phone}
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </motion.section>

        <footer className={styles.footer}>
          <span>Mumbai · India</span>
          <span>SITESMITH © {new Date().getFullYear()}</span>
        </footer>
      </main>
    </div>
  );
}
