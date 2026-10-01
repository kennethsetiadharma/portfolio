"use client";

import { MotionConfig } from "motion/react";

// Root-level config: honours prefers-reduced-motion for every Motion component.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
