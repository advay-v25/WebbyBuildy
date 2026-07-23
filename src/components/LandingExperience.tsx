"use client";

import { useGSAP } from "@gsap/react";
import { animate } from "animejs";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Compass } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import Image from "next/image";
import Link from "next/link";
import { CSSProperties, useCallback, useEffect, useRef, useState, SVGProps } from "react";
import styles from "@/app/page.module.css";
import { SiteHeader } from "@/components/SiteHeader";
import ScrollScrubVideo from "@/components/ScrollScrubVideo";
import { CinematicMotionField } from "@/components/CinematicMotionField";

gsap.registerPlugin(ScrollTrigger);

const founders = [
  ["Aarav", "Aher", "International Business at Northeastern"],
  ["Abhimanyu", "Gupta", "Cadet with IndiGo"],
  ["Advay", "Vaidya", "CFA aspirant"],
] as const;

const DesigningIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <g transform="scale(0.7) translate(2, 2)">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
      <rect x="9" y="9" width="6" height="6"></rect>
      <line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line>
    </g>
    <g transform="scale(0.6) translate(16, 16)">
      <path d="M15 12l-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"></path>
      <path d="M17.64 15L22 10.64"></path>
      <path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"></path>
    </g>
  </svg>
);

const RefiningIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <g transform="scale(0.65) translate(1, 9)">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
      <rect x="9" y="9" width="6" height="6"></rect>
      <line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line>
    </g>
    <g transform="scale(0.9) translate(9, -2)">
      <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"></path>
      <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" fill="white"></path>
      <path d="M4 2v4m-2-2h4" strokeWidth="1.5" />
    </g>
  </svg>
);

const DeliveryIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <g transform="scale(0.8) translate(3, 4)">
      <polyline points="20 12 20 22 4 22 4 12"></polyline>
      <rect x="2" y="7" width="20" height="5"></rect>
      <line x1="12" y1="22" x2="12" y2="7"></line>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
    </g>
    <path d="M4 2v4m-2-2h4" strokeWidth="1.5" />
    <path d="M20 5v4m-2-2h4" strokeWidth="1.5" />
    <path d="M19 16v4m-2-2h4" strokeWidth="1.5" />
  </svg>
);

const capabilities = [
  ["01", "Direction", "Grasping what to make before starting - your requirements, specifics, even just the feel you want to bring to your website", Compass],
  ["02", "Designing", "Turning your demands into tangible realities as we build your perfect website", DesigningIcon],
  ["03", "Refining", "Any changes or improvements you may want, all the way down to the smallest intricacies, made without any hassle", RefiningIcon],
  ["04", "Delivery", "Delivering your ideal website to you, ready for use by your own clients", DeliveryIcon],
] as const;

const projects = [
  { number: "01", title: "PlannrAI", copy: "A complete AI-powered product, designed, built and launched by the three of us", live: true, image: "/images/plannrai-hero.png", link: "https://plannrai.in" },
  { number: "02", title: "Be3", copy: "A human resources platform shaped around clearer services, stronger trust and a more confident digital presence", live: true, image: "/images/be3-hero.png", link: "https://be3.co.in" },
  { number: "03", title: "Private Consulting Website", copy: "A private consulting site that positions an individual brand", live: true, image: "/images/client3-consulting.png", link: "#" },
] as const;

const deckPose = (index: number, active: number) => {
  const position = (index - active + projects.length) % projects.length;
  if (position === 0) return { x: "0%", y: 0, scale: 1, rotateY: 0, opacity: 1, zIndex: 6 };
  if (position === 1) return { x: "58%", y: 24, scale: 0.76, rotateY: -13, opacity: 0.56, zIndex: 3 };
  return { x: "-38%", y: 30, scale: 0.68, rotateY: 14, opacity: 0.38, zIndex: 2 };
};

const keyboardFragments = Array.from({ length: 60 }, (_, index) => {
  const columns = 10;
  const rows = 6;
  const column = index % columns;
  const row = Math.floor(index / columns);
  return {
    index,
    column,
    row,
    left: `${(column * 100) / columns}%`,
    top: `${(row * 100) / rows}%`,
    backgroundPosition: `${(column * 100) / (columns - 1)}% ${(row * 100) / (rows - 1)}%`,
  };
});

export default function LandingExperience() {
  const root = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const introVideo = useRef<HTMLVideoElement>(null);
  const spaceKey = useRef<HTMLSpanElement>(null);
  const entranceTimeline = useRef<gsap.core.Timeline | null>(null);
  const entranceComplete = useRef(false);
  const introSettled = useRef(false);
  const videoDecoded = useRef(false);
  const lenis = useLenis(() => ScrollTrigger.update());
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [activeCapability, setActiveCapability] = useState(0);
  const [hoveredCapability, setHoveredCapability] = useState<number | null>(null);
  const [activeFounder, setActiveFounder] = useState(0);
  const [activeSection, setActiveSection] = useState<"top" | "work" | "process" | "founders" | "contact">("top");

  const enterSite = useCallback(() => {
    if (entranceComplete.current || entranceTimeline.current?.isActive()) return;
    setIsSpacePressed(true);
    if (spaceKey.current) {
      animate(spaceKey.current, {
        translateY: [0, 7, 0],
        scale: [1, 0.975, 1],
        duration: 720,
        ease: "inOutQuint",
      });
    }
    introVideo.current?.pause();
    entranceTimeline.current?.restart();
  }, []);

  const settleIntro = useCallback(() => {
    if (introSettled.current) return;
    introSettled.current = true;
    gsap.to(introVideo.current, { opacity: 0, duration: 1.05, ease: "power2.inOut" });
    gsap.to("[data-keyboard-idle]", { opacity: 1, duration: 1.05, ease: "power2.inOut" });
  }, []);

  const moveProject = useCallback((direction: -1 | 1) => {
    setActiveProject((current) => (current + direction + projects.length) % projects.length);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.code === "Space") {
        event.preventDefault();
        enterSite();
      } else if (event.code === "ArrowLeft") {
        event.preventDefault();
        moveProject(-1);
      } else if (event.code === "ArrowRight") {
        event.preventDefault();
        moveProject(1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [enterSite, moveProject]);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (window.scrollY < 12 && event.deltaY > 12 && !entranceComplete.current) {
        event.preventDefault();
        enterSite();
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [enterSite]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          if (registration.scope.startsWith(window.location.origin)) void registration.unregister();
        });
      }).catch(() => undefined);
    }

    const fallback = window.setTimeout(() => {
      if (!videoDecoded.current) settleIntro();
    }, 4200);
    document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => undefined);

    return () => {
      window.clearTimeout(fallback);
    };
  }, [settleIntro]);

  // Honor a hash target on load (e.g. arriving at /#work from the book page).
  // ScrollTrigger's pinned hero shifts section offsets, so wait for layout to
  // settle, refresh, then jump straight to the target section.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash === "#top") return;
    let done = false;

    const goToHash = () => {
      if (done) return;
      const target = document.querySelector(hash);
      if (!target) return;
      done = true;
      ScrollTrigger.refresh();
      requestAnimationFrame(() => {
        if (lenis) lenis.scrollTo(target as HTMLElement, { immediate: true, force: true });
        else (target as HTMLElement).scrollIntoView();
      });
    };

    const timer = window.setTimeout(goToHash, 400);
    document.fonts.ready.then(goToHash).catch(() => undefined);
    return () => window.clearTimeout(timer);
  }, [lenis]);

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      entranceTimeline.current = gsap.timeline({ paused: true, onComplete: () => { entranceComplete.current = true; } })
        .set("[data-hero-copy-wrap],[data-space-prompt]", { opacity: 0 })
        .set("[data-story-curtain]", { yPercent: 0, opacity: 1 })
        .set("[data-curtain-copy]", { opacity: 1, y: 0 });
      return;
    }

    const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
    intro
      .fromTo("[data-hero-line]", { yPercent: 110 }, { yPercent: 0, duration: 1.15, stagger: 0.08 })
      .fromTo("[data-hero-copy]", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.55")
      .fromTo("[data-space-prompt]", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.65 }, "-=0.4");

    gsap.set("[data-keyboard-pressed]", { opacity: 0 });
    gsap.set("[data-keyboard-fragment]", { opacity: 0 });
    gsap.set("[data-keyboard-energy]", { opacity: 0 });
    gsap.set("[data-energy-core]", { opacity: 0, scaleX: .04, transformOrigin: "12% 50%" });
    gsap.set("[data-energy-rays]", { opacity: 0, xPercent: -135, scaleX: .7, transformOrigin: "50% 50%" });
    gsap.set("[data-energy-outline]", { opacity: 0, scale: .985, transformOrigin: "50% 50%" });
    gsap.set("[data-story-curtain]", { yPercent: 100, opacity: 0 });

    const resetEntrance = () => {
      entranceTimeline.current?.pause(0);
      entranceComplete.current = false;
      setIsSpacePressed(false);
      gsap.set("[data-story-curtain]", { yPercent: 100, opacity: 0 });
      gsap.set("[data-curtain-copy]", { opacity: 0, y: 36 });
      gsap.set("[data-keyboard-fragment]", { opacity: 0, clearProps: "transform,filter" });
      gsap.set("[data-keyboard-energy],[data-energy-core],[data-energy-rays],[data-energy-outline]", { opacity: 0, clearProps: "transform,filter" });
      gsap.set("[data-keyboard-pressed]", { opacity: 0, clearProps: "transform" });
      gsap.set("[data-keyboard-idle]", { opacity: 1, clearProps: "transform" });
      gsap.set("[data-hero-copy-wrap],[data-space-prompt]", { opacity: 1, clearProps: "transform" });
    };

    ScrollTrigger.create({
      id: "hero-cinematic",
      trigger: hero.current,
      start: "top top",
      end: "+=100%",
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (self.progress > 0.008 && !entranceComplete.current && !entranceTimeline.current?.isActive()) enterSite();
        if (self.progress <= 0.001 && self.direction < 0 && entranceComplete.current) resetEntrance();
      },
      onLeaveBack: resetEntrance,
    });

    entranceTimeline.current = gsap.timeline({
      paused: true,
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        entranceComplete.current = true;
        setIsSpacePressed(false);
      },
    });

    entranceTimeline.current
      // Beat one — the interface quiets before the physical press
      .to("[data-space-prompt]", { opacity: 0, y: 14, duration: 0.55, ease: "power2.in" }, 0)
      .to("[data-hero-copy-wrap]", { opacity: 0, y: -28, duration: 0.9, ease: "power2.inOut" }, 0.08)
      .to(introVideo.current, { opacity: 0, duration: 0.7, ease: "power2.inOut" }, 0)
      // Beat two — compression, light response, then a deliberate hold
      .to("[data-keyboard-idle]", { y: 11, scale: 0.996, opacity: 0, duration: 0.48, ease: "power2.in" }, 0.2)
      .fromTo("[data-keyboard-pressed]", { opacity: 0, y: 0, scale: 1.002 }, { opacity: 1, y: 11, scale: 0.996, duration: 0.48, ease: "power2.out" }, 0.22)
      .fromTo("[data-hero-flash]", { opacity: 0 }, { opacity: 0.2, duration: 0.28, ease: "sine.out" }, 0.36)
      .to("[data-hero-flash]", { opacity: 0, duration: 0.8, ease: "sine.out" }, 0.64)
      // The signal originates beneath the physical space bar and travels across the board
      .to("[data-keyboard-energy]", { opacity: 1, duration: .16, ease: "power1.out" }, .48)
      .to("[data-energy-core]", { opacity: .94, scaleX: 1, duration: .92, ease: "power2.inOut" }, .48)
      .to("[data-energy-rays]", { opacity: .86, xPercent: 130, scaleX: 1, duration: 1.08, ease: "power2.inOut" }, .5)
      .to("[data-energy-outline]", { opacity: .9, scale: 1, duration: .72, ease: "power2.out" }, .82)
      .to("[data-energy-core]", { opacity: .68, filter: "brightness(1.32)", duration: .42, ease: "sine.inOut" }, 1.14)
      .to("[data-energy-core],[data-energy-rays],[data-energy-outline]", { opacity: 0, duration: .7, ease: "sine.inOut" }, 1.42)
      .to("[data-keyboard-energy]", { opacity: 0, duration: .12 }, 1.98)
      .set("[data-keyboard-fragment]", { opacity: 1 }, 1.7)
      // Beat three — pieces release from the space-bar region and fall under gravity
      .to("[data-keyboard-fragment]", {
        x: (index) => ((index % 10) - 4.5) * 13 + ((index * 17) % 31) - 15,
        y: (index) => window.innerHeight * (1.02 + Math.floor(index / 10) * .055 + ((index * 23) % 17) / 100),
        z: (index) => 45 + (index % 6) * 28,
        rotateX: (index) => 18 + (index % 5) * 12,
        rotateY: (index) => ((index % 3) - 1) * 18,
        rotateZ: (index) => ((index % 2 ? 1 : -1) * (5 + (index % 10) * 1.2)),
        scale: (index) => 0.82 + (index % 4) * 0.035,
        stagger: { each: 0.032, grid: [6, 10], from: 54 },
        duration: 2.55,
        ease: "power2.in",
      }, 1.72)
      .to("[data-keyboard-fragment]", { opacity: 0, duration: .88, stagger: { each: .018, grid: [6, 10], from: 54 }, ease: "power1.in" }, 3.42)
      .to("[data-keyboard-pressed]", { opacity: 0, y: 70, scale: .985, duration: 1.4, ease: "power2.in" }, 1.82)
      // Beat four — the next chapter arrives only after the physical action reads
      .fromTo("[data-story-curtain]", { yPercent: 100, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 1.85, ease: "expo.inOut" }, 2.62)
      .fromTo("[data-curtain-line]", { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "power3.out" }, 3.88)
      .fromTo("[data-curtain-copy]", { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 1.12, ease: "power3.out" }, 4.05)
      .to(hero.current, { "--hero-shade-opacity": 0, duration: 1, ease: "power1.out" }, 3.45);

    ([
      ["#top", "top"],
      ["#work", "work"],
      ["#process", "process"],
      ["#founders", "founders"],
      ["#contact", "contact"],
    ] as const).forEach(([selector, section]) => {
      ScrollTrigger.create({
        trigger: selector,
        start: "top 48%",
        end: "bottom 48%",
        onEnter: () => setActiveSection(section),
        onEnterBack: () => setActiveSection(section),
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
      gsap.from(element, {
        opacity: 0,
        y: 28,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: element, start: "top 86%", toggleActions: "play none none reverse" },
      });
    });

    const capabilityTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: "[data-capabilities]",
        start: "top 78%",
        toggleActions: "play none none reverse",
      },
    });
    capabilityTimeline
      .from("[data-capability-copy]", { opacity: 0, xPercent: -8, duration: 0.22 }, 0)
      .from("[data-system-node]", { opacity: 0, y: 70, rotateX: -28, stagger: 0.08, duration: 0.58, ease: "power2.out" }, 0.04)
      .fromTo("[data-energy-path]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.72, ease: "none" }, 0.16)
      .from("[data-capability-note]", { opacity: 0, y: 30, duration: 0.2 }, 0.62);

    const desktopMotion = gsap.matchMedia();
    desktopMotion.add("(min-width: 801px)", () => {
      const capabilityLock = ScrollTrigger.create({
        id: "capability-cinematic-lock",
        trigger: "[data-capabilities]",
        start: "top top",
        end: "+=170%",
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          setActiveCapability(Math.min(capabilities.length - 1, Math.floor(progress * capabilities.length)));
        },
      });
      return () => capabilityLock.kill();
    });

    gsap.timeline({
      scrollTrigger: {
        trigger: "#work",
        start: "top 98%",
        end: "top 28%",
        scrub: 1.15,
      },
    })
      .fromTo("[data-work-wipe]", { yPercent: 0 }, { yPercent: -104, ease: "power3.inOut" }, 0)
      .fromTo("[data-work-heading]", { opacity: 0, y: 56 }, { opacity: 1, y: 0, ease: "power2.out" }, .2)
      .fromTo("[data-project-rail]", { opacity: .08, y: 54, scale: .975 }, { opacity: 1, y: 0, scale: 1, ease: "power2.out" }, .28);

    gsap.utils.toArray<HTMLElement>("[data-project-panel]").forEach((panel, index) => {
      gsap.from(panel, {
        opacity: 0,
        clipPath: index === 0 ? "inset(0 0 100% 0 round 28px)" : "inset(0 0 0 100% round 28px)",
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: panel, start: "top 88%" },
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-zoom-media]").forEach((media) => {
      gsap.fromTo(media, { scale: 1.08 }, {
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: media, start: "top bottom", end: "bottom top", scrub: 0.8 },
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((layer, index) => {
      gsap.fromTo(layer, { yPercent: index % 2 ? -8 : 8 }, {
        yPercent: index % 2 ? 8 : -8,
        ease: "none",
        scrollTrigger: { trigger: layer.parentElement, start: "top bottom", end: "bottom top", scrub: 0.8 },
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-section-stage]").forEach((stage) => {
      gsap.fromTo(stage, { y: 88, scale: .955, rotateX: 7, transformOrigin: "50% 100%" }, {
        y: 0,
        scale: 1,
        rotateX: 0,
        ease: "none",
        scrollTrigger: { trigger: stage, start: "top 94%", end: "top 55%", scrub: 1 },
      });
    });

    gsap.fromTo("[data-founder-panel]", {
      opacity: 0,
      clipPath: "inset(0 100% 0 0 round 26px)",
    }, {
      opacity: 1,
      clipPath: "inset(0 0% 0 0 round 26px)",
      stagger: 0.08,
      ease: "none",
      scrollTrigger: { trigger: "[data-founder-grid]", start: "top 94%", end: "top 56%", scrub: 0.75 },
    });

    ScrollTrigger.create({
      trigger: "[data-founder-grid]",
      start: "top 88%",
      end: "bottom 46%",
      onUpdate: ({ progress }) => setActiveFounder(Math.min(founders.length - 1, Math.floor(progress * founders.length))),
    });

    gsap.fromTo("[data-contact-arch]", { scaleY: 0.08, yPercent: 46 }, {
      scaleY: 1,
      yPercent: 0,
      ease: "none",
      scrollTrigger: { trigger: "#contact", start: "top 92%", end: "top 34%", scrub: 0.9 },
    });

    const cleanups: Array<() => void> = [];
    gsap.utils.toArray<HTMLElement>("[data-magnetic]").forEach((element) => {
      const xTo = gsap.quickTo(element, "--magnet-x", { duration: 0.35, ease: "power3.out" });
      const yTo = gsap.quickTo(element, "--magnet-y", { duration: 0.35, ease: "power3.out" });
      const onMove = (event: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        xTo((event.clientX - rect.left - rect.width / 2) * 0.16);
        yTo((event.clientY - rect.top - rect.height / 2) * 0.16);
      };
      const onLeave = () => { xTo(0); yTo(0); };
      element.addEventListener("mousemove", onMove);
      element.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        element.removeEventListener("mousemove", onMove);
        element.removeEventListener("mouseleave", onLeave);
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-tilt]").forEach((element) => {
      const rotateXTo = gsap.quickTo(element, "--tilt-x", { duration: 0.45, ease: "power3.out" });
      const rotateYTo = gsap.quickTo(element, "--tilt-y", { duration: 0.45, ease: "power3.out" });
      const onMove = (event: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        rotateXTo(((event.clientY - rect.top) / rect.height - 0.5) * -7);
        rotateYTo(((event.clientX - rect.left) / rect.width - 0.5) * 7);
      };
      const onLeave = () => { rotateXTo(0); rotateYTo(0); };
      element.addEventListener("mousemove", onMove);
      element.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        element.removeEventListener("mousemove", onMove);
        element.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => {
      desktopMotion.revert();
      cleanups.forEach((cleanup) => cleanup());
    };
  }, { scope: root });

  return (
    <div ref={root} className={styles.site}>
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <SiteHeader activeSection={activeSection} />

      <main id="main-content">
        <section id="top" ref={hero} className={styles.hero}>
          <div data-hero-copy-wrap className={styles.heroCopy}>
            <h1 aria-label="Websites that move at the speed of your idea">
              <span className={styles.lineClip}><span data-hero-line>Websites that move</span></span>
              <span className={styles.lineClip}><span data-hero-line>at the speed of</span></span>
              <span className={styles.lineClip}><span data-hero-line>your idea</span></span>
            </h1>
            <p data-hero-copy>Custom websites, built in days, directly with the people making them</p>
          </div>

          <div className={styles.heroMedia} aria-hidden="true">
            <video
              ref={introVideo}
              className={`${styles.heroVideo} ${videoReady ? styles.heroVideoReady : ""}`}
              autoPlay
              muted
              playsInline
              preload="auto"
              poster="/hero/keyboard-intro-clean-poster.jpg"
              onCanPlay={() => {
                videoDecoded.current = true;
                setVideoReady(true);
              }}
              onTimeUpdate={(event) => {
                const video = event.currentTarget;
                if (video.duration && video.duration - video.currentTime < 1.05) settleIntro();
              }}
              onEnded={settleIntro}
              onError={() => {
                setVideoReady(false);
                settleIntro();
              }}
            >
              <source src="/hero/keyboard-intro-clean.mp4" type="video/mp4" />
            </video>
            <div data-keyboard-idle className={styles.keyboardIdle} />
            <div data-keyboard-pressed className={styles.keyboardPressed} />
            <div data-keyboard-energy className={styles.keyboardEnergy}>
              <i data-energy-rays className={styles.keyboardEnergyRays} />
              <i data-energy-outline className={styles.keyboardEnergyOutline} />
              <i data-energy-core className={styles.keyboardEnergyCore} />
            </div>
            <div className={styles.keyboardFragments}>
              {keyboardFragments.map(({ index, column, row, left, top, backgroundPosition }) => (
                <i
                  data-keyboard-fragment
                  key={index}
                  style={{ left, top, backgroundPosition, "--fragment-column": column, "--fragment-row": row } as CSSProperties}
                />
              ))}
            </div>
            <div data-hero-flash className={styles.heroFlash} />
          </div>

          <button data-space-prompt className={`${styles.spacePrompt} ${isSpacePressed ? styles.spacePressed : ""}`} onClick={enterSite}>
            <span ref={spaceKey} className={styles.spaceKey}>PRESS SPACE TO ENTER</span>
            <span className={styles.scrollLabel}>or scroll to explore <ArrowDownRight size={14} /></span>
          </button>

          <div data-story-curtain className={styles.storyCurtain}>
            <div data-curtain-line className={styles.curtainLine} />
            <div data-curtain-copy>
              <strong>Built to be used<br /><em>Designed to be felt</em></strong>
              <p>Strategy, design, development and motion — without the agency drag</p>
            </div>
          </div>
        </section>

        <section id="work" data-cinematic-section className={styles.workSection}>
          <div data-work-wipe className={styles.workTransitionWipe} aria-hidden="true"><i /></div>
          <CinematicMotionField variant="work" />
          <div data-work-heading className={styles.workHeading}>
            <h2>Work that <span>earns</span> attention</h2>
            <div className={styles.workUtility}>
              <p>Every project is built with close attention, personal collaboration and a design approach shaped around the people it needs to serve</p>
              <div className={styles.carouselControls} aria-label="Project carousel controls">
                <button onClick={() => moveProject(-1)} aria-label="Previous project"><ArrowLeft size={17} /></button>
                <span>0{activeProject + 1} / 03</span>
                <button onClick={() => moveProject(1)} aria-label="Next project"><ArrowRight size={17} /></button>
              </div>
            </div>
          </div>
          <div data-project-rail className={styles.projectRail}>
            {projects.map((project, index) => (
              <motion.article
                data-project-panel
                data-project-index={index}
                data-active={activeProject === index}
                tabIndex={0}
                role="button"
                aria-label={project.live ? `Preview ${project.title}` : `Preview future project slot ${project.number}`}
                aria-pressed={activeProject === index}
                onFocus={() => setActiveProject(index)}
                onClick={() => setActiveProject(index)}
                key={project.number}
                className={`${styles.projectPanel} ${project.live ? styles.liveProject : styles.futureProject}`}
                animate={deckPose(index, activeProject)}
                whileHover={activeProject === index ? { y: -12, rotateX: -2.5, rotateY: 2.5, scale: 1.018 } : { y: 12, opacity: .74 }}
                whileTap={{ scale: .985 }}
                transition={{ type: "spring", stiffness: 145, damping: 24, mass: 1.05 }}
              >
                {project.live ? (
                  <div data-zoom-media className={styles.liveMedia}>
                    <Image src={project.image} alt={`${project.title} website screenshot`} fill loading="eager" sizes="(max-width: 800px) 100vw, 55vw" />
                  </div>
                ) : (
                  <><div className={styles.redSeam} aria-hidden="true" /><div className={styles.futureGeometry} aria-hidden="true"><i /><i /><i /></div></>
                )}
                <div className={styles.projectMeta}><span>{project.number} · {project.live && project.title === "PlannrAI" ? "AI PRODUCT" : (project.live ? "CLIENT SITE" : "NEXT PROJECT")}</span>{project.live ? <strong>LIVE</strong> : null}</div>
                <div className={styles.projectCopy}>
                  <h3>{project.live ? project.title : <>Next<br />project</>}</h3>
                  <p>{project.copy}</p>
                </div>
                {project.live && activeProject === index ? (
                  <a className={styles.projectVisit} href={project.link} target="_blank" rel="noreferrer" aria-label={`Visit ${project.title}`}><ArrowUpRight /></a>
                ) : <ArrowDownRight className={styles.projectArrow} aria-hidden="true" />}
              </motion.article>
            ))}
          </div>
        </section>

        <section id="process" data-capabilities data-cinematic-section className={styles.capabilitiesSection}>
          <div className={styles.capabilitiesLeft}>
            <div className={styles.capabilitiesCopy} data-capability-copy>
              <p className={styles.mono}>ONE CONTINUOUS SYSTEM</p>
              <h2>From a spark to a<br />site people <em>remember</em></h2>
            </div>
            <p data-capability-note className={styles.capabilityNote}><em>Every interaction has a job</em><br />Every frame moves the story forward</p>
          </div>
          <div data-section-stage className={styles.systemStage}>
            <div className={styles.systemRail} aria-hidden="true"><i /></div>
            <div className={styles.systemNodes}>
            {capabilities.map(([number, title, copy, Icon], index) => (
              <motion.button
                data-system-node
                data-active={activeCapability === index || hoveredCapability === index}
                aria-label={`${title}: ${copy}`}
                onClick={() => setActiveCapability(index)}
                onMouseEnter={() => setHoveredCapability(index)}
                onMouseLeave={() => setHoveredCapability(null)}
                onFocus={() => setHoveredCapability(index)}
                onBlur={() => setHoveredCapability(null)}
                key={number}
                className={styles.systemNode}
                animate={activeCapability === index || hoveredCapability === index ? { y: -12, scale: 1.07, rotateX: -6, rotateY: index % 2 ? 5 : -5, opacity: 1 } : { y: 5, scale: .91, rotateX: 0, rotateY: 0, opacity: .62 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 190, damping: 22 }}
              >
                <span className={styles.nodeIndex}>{number}</span>
                <span className={styles.optic}><Icon aria-hidden="true" /><i /><b /></span>
                <span className={styles.nodeTitle}>{title}</span>
              </motion.button>
            ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.aside key={activeCapability} className={styles.capabilityDisplay} initial={{ opacity: 0, y: 18, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12, filter: "blur(6px)" }} transition={{ duration: 0.34 }}>
                <span>ACTIVE MODULE · {capabilities[activeCapability][0]}</span>
                <h3>{capabilities[activeCapability][1]}</h3>
                <p>{capabilities[activeCapability][2]}</p>
              </motion.aside>
            </AnimatePresence>
            <svg className={styles.energyLine} viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true">
              <defs><filter id="redGlow"><feGaussianBlur stdDeviation="7" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
              <path data-energy-path pathLength="1" d="M-40 370 C90 340 120 288 230 300 S350 250 440 254 S540 195 625 208 S740 118 805 142 S920 60 1040 28" />
            </svg>
          </div>
        </section>

        <section id="how-it-works" className={styles.howItWorksSection}>
          <ScrollScrubVideo />
        </section>

        <section id="founders" data-cinematic-section className={styles.foundersSection}>
          <CinematicMotionField variant="studio" />
          <div data-reveal className={styles.foundersIntro}>
            <p className={styles.mono}>FOUNDERS / STUDIO</p>
            <h2>Three paths<br /><span>One studio</span></h2>
            <p className={styles.founderLead}>Three friends from Mumbai, building with the tools agencies will be using five years from now</p>
            <p className={styles.founderSmall}>You speak directly to the people designing and building your site No account managers No hand-offs</p>
                <Link data-magnetic href="/studio/team" className={styles.founderButton}>Meet the studio <ArrowUpRight size={18} /></Link>
          </div>
          <div data-founder-grid data-section-stage className={styles.founderGrid}>
            <div className={styles.founderPanorama} aria-hidden="true">
              <Image src="/images/studio-founders-panorama.png" alt="" fill sizes="(max-width: 800px) 100vw, 68vw" />
            </div>
            {founders.map(([first, last, discipline], index) => (
              <article
                data-founder-panel
                data-tilt
                data-active={activeFounder === index}
                tabIndex={0}
                onMouseEnter={() => setActiveFounder(index)}
                onFocus={() => setActiveFounder(index)}
                onClick={() => setActiveFounder(index)}
                key={first}
                className={styles.founderPanel}
              >
                <ArrowUpRight className={styles.founderPanelArrow} aria-hidden="true" />
                <div><h3>{first} {last}</h3><p>{discipline}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" data-cinematic-section className={styles.contactSection}>
          <CinematicMotionField variant="finale" />
          <div data-contact-arch className={styles.contactArch} aria-hidden="true" />
          <div data-reveal>
            <h2>Have something<br /><span>worth building</span></h2>
            <a href="mailto:studio@sitesmith.co.in" className={styles.email}>studio@sitesmith.co.in</a>
          </div>
          <Link data-reveal data-magnetic href="/book" className={styles.bookButton}>Book a free call <ArrowUpRight size={21} /></Link>
          <footer><span>Mumbai · India</span><span>SITESMITH © {new Date().getFullYear()}</span></footer>
        </section>
      </main>
    </div>
  );
}
