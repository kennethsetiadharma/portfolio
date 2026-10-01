"use client";

import dynamic from "next/dynamic";
import { useInView, type MotionValue } from "motion/react";
import { preload } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { useCanRender3D } from "@/hooks/use-can-render-3d";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { HeroErrorBoundary } from "./HeroErrorBoundary";
import { DIE } from "./die-config";
import { HeroFallback } from "./HeroFallback";

// three.js lives in its own chunk and is only downloaded when HeroScene is
// actually rendered. ssr: false because WebGL only exists in the browser.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

// The still die and the 3D die show the same pose in the same place, so the hand-off is: fade
// the 3D in on top (IN), keep the still fully opaque underneath until that's done, then drop
// it quickly. No dip in the middle. If the 3D later fails, the still comes straight back.
const STILL = "transition-opacity ease-out motion-reduce:transition-none";
const IN = "transition-opacity duration-300 motion-reduce:transition-none";

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
  // The still die is what you see first, so it gets the bandwidth first: the 3D scene only
  // starts downloading once it has loaded (starting both at once made the still arrive later
  // on slow connections).
  const [stillLoaded, setStillLoaded] = useState(false);
  const [ready, setReady] = useState(false); // first 3D frames are on screen
  const [failed, setFailed] = useState(false); // gave up on 3D for this visit

  const box = useRef<HTMLDivElement>(null);
  // Stop rendering while the hero is off-screen (with a small margin so it wakes up
  // just before you scroll back). `initial: true` avoids pausing before the first check.
  const inView = useInView(box, {
    margin: "100px 0px 100px 0px",
    initial: true,
  });

  const show3D = canRender3D && stillLoaded && !failed;
  // The scene fetches the K shape only after it has downloaded and rendered. Ask for it now so
  // it is already there (removes a wait of 100-200 ms).
  useEffect(() => {
    if (show3D) preload(DIE.kSvg, { as: "fetch", crossOrigin: "anonymous" });
  }, [show3D]);

  const fail = () => {
    setFailed(true);
    setReady(false); // the static die fades back in
  };

  return (
    // touch-pan-y: vertical swipes over the die scroll the page as normal.
    <div
      ref={box}
      className={cn("relative touch-pan-y", className)}
      // Makes this box a size container, so HeroFallback can size the still die from the
      // box's own width and height (cqw / cqh). Safe: the box has an explicit size.
      style={{ containerType: "size" }}
    >
      {/* Static die: what you see first, and what stays for reduced motion, no WebGL,
          or if the device can't keep up. It fades out once the canvas is ready. */}
      <div
        className={cn(
          "absolute inset-0",
          STILL,
          ready
            ? "opacity-0 delay-300 duration-100"
            : "opacity-100 duration-200",
        )}
      >
        <HeroFallback onLoad={() => setStillLoaded(true)} />
      </div>
      {show3D && (
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
