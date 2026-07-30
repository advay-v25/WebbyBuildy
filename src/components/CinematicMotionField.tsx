"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import styles from "@/app/page.module.css";

type MotionFieldVariant = "work" | "system" | "studio" | "booking" | "finale";

export function CinematicMotionField({ variant, className = "" }: { variant: MotionFieldVariant; className?: string }) {
  const field = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 55, damping: 24, mass: .7 });
  const smoothY = useSpring(pointerY, { stiffness: 55, damping: 24, mass: .7 });
  const nearX = useTransform(smoothX, (value) => value * 18);
  const nearY = useTransform(smoothY, (value) => value * 14);
  const farX = useTransform(smoothX, (value) => value * -9);
  const farY = useTransform(smoothY, (value) => value * -7);
  const rotateX = useTransform(smoothY, [-1, 1], [4, -4]);
  const rotateY = useTransform(smoothX, [-1, 1], [-5, 5]);

  useEffect(() => {
    const element = field.current?.parentElement;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const move = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      pointerX.set(((event.clientX - rect.left) / rect.width - .5) * 2);
      pointerY.set(((event.clientY - rect.top) / rect.height - .5) * 2);
    };
    const leave = () => { pointerX.set(0); pointerY.set(0); };
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    return () => {
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
    };
  }, [pointerX, pointerY]);

  return (
    <div ref={field} data-motion-field aria-hidden="true" className={`${styles.motionField} ${styles[`motionField_${variant}`]} ${className}`}>
      <motion.div className={styles.motionFieldGrid} style={{ x: farX, y: farY, rotateX, rotateY }} />
      <motion.div className={styles.motionOrbit} style={{ x: nearX, y: nearY, rotateX, rotateY }}>
        <i /><i /><i /><b />
      </motion.div>
      <motion.div className={styles.motionPrism} style={{ x: farX, y: nearY, rotateX, rotateY }}><i /><i /><i /></motion.div>
      <motion.div className={styles.motionBeam} style={{ x: nearX, y: farY }} />
      <motion.div className={styles.motionDust} style={{ x: farX, y: farY }} />
    </div>
  );
}
