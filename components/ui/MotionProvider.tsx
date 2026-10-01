"use client";

import { domAnimation, LazyMotion, MotionConfig } from "motion/react";

/** Lean motion runtime (only the DOM-animation features Reveal needs). */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
