"use client";

import dynamic from "next/dynamic";
import type { MotionValue } from "motion/react";
import { useCanRender3D } from "@/hooks/use-can-render-3d";
import { HeroFallback } from "./HeroFallback";

// three.js lives in its own chunk and is only downloaded when HeroScene is
// actually rendered. ssr: false because WebGL only exists in the browser.
const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <HeroFallback />,
});

export function HeroCanvas({
  className,
  progress,
}: {
  className?: string;
  /** 0 to 1 as the hero scrolls away; drives extra 3D rotation. */
  progress?: MotionValue<number>;
}) {
  const canRender3D = useCanRender3D();

  return (
    <div className={className}>
      {canRender3D ? <HeroScene progress={progress} /> : <HeroFallback />}
    </div>
  );
}
