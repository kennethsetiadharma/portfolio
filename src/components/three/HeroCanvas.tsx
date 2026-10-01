"use client";

import dynamic from "next/dynamic";
import { useInView, type MotionValue } from "motion/react";
import { useRef, useState } from "react";
import { useCanRender3D } from "@/hooks/use-can-render-3d";
import { useIdle } from "@/hooks/use-idle";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { HeroErrorBoundary } from "./HeroErrorBoundary";
import { HeroFallback } from "./HeroFallback";

// three.js lives in its own chunk and is only downloaded when HeroScene is
// actually rendered. ssr: false because WebGL only exists in the browser.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

// The logo leaves quickly (fade + slight shrink) and the 3D arrives just after, so the
// two very different shapes barely overlap on screen.
const OUT =
  "transition-[opacity,scale] duration-300 ease-out motion-reduce:transition-none";
const IN =
  "transition-opacity duration-500 delay-150 motion-reduce:transition-none";

export function HeroCanvas({
  className,
  progress,
}: {
  className?: string;
  /** 0 to 1 as the hero scrolls away; drives extra 3D rotation. */
  progress?: MotionValue<number>;
}) {
  const canRender3D = useCanRender3D();
  // Touch screens and small windows get a lower pixel-density cap (see HeroScene).
  const isSmall = useMediaQuery("(max-width: 767px), (pointer: coarse)");
  // Don't even start downloading three.js until the page has settled.
  const idle = useIdle();
  const [ready, setReady] = useState(false); // first 3D frames are on screen
  const [failed, setFailed] = useState(false); // gave up on 3D for this visit

  const box = useRef<HTMLDivElement>(null);
  // Stop rendering while the hero is off-screen (with a small margin so it wakes up
  // just before you scroll back). `initial: true` avoids pausing before the first check.
  const inView = useInView(box, {
    margin: "100px 0px 100px 0px",
    initial: true,
  });

  const fail = () => {
    setFailed(true);
    setReady(false); // the static die fades back in
  };

  return (
    // touch-pan-y: vertical swipes over the die scroll the page as normal.
    <div ref={box} className={cn("relative touch-pan-y", className)}>
      {/* Static die: what you see first, and what stays for reduced motion, no WebGL,
          or if the device can't keep up. It fades out once the canvas is ready. */}
      <div
        className={cn("absolute inset-0", OUT, ready && "scale-95 opacity-0")}
      >
        <HeroFallback />
      </div>
      {canRender3D && idle && !failed && (
        <div
          className={cn(
            "absolute inset-0",
            IN,
            ready ? "opacity-100" : "opacity-0",
          )}
        >
          <HeroErrorBoundary onError={fail}>
            <HeroScene
              progress={progress}
              paused={!inView}
              dprMax={isSmall ? 1.5 : 2}
              onReady={() => setReady(true)}
              onFail={fail}
            />
          </HeroErrorBoundary>
        </div>
      )}
    </div>
  );
}
