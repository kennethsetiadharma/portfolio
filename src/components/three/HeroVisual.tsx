"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { HeroCanvas } from "./HeroCanvas";

// Distance (px) over which the object finishes fading out.
const SCROLL_DISTANCE = 600;

// The signature moment: as you scroll away, the die settles K-forward (driven by
// `progress` inside HeroScene), then fades out.
export function HeroVisual({ className }: { className?: string }) {
  const { scrollY } = useScroll();
  const progress = useTransform(scrollY, [0, SCROLL_DISTANCE], [0, 1], {
    clamp: true,
  });
  // Stays fully visible for the first part of the scroll so you see it settle, then fades.
  const opacity = useTransform(progress, [0.55, 1], [1, 0]);
  const scale = useTransform(progress, [0, 1], [1, 0.85]);

  return (
    <motion.div className={className} style={{ opacity, scale }}>
      <HeroCanvas className="size-full" progress={progress} />
    </motion.div>
  );
}
