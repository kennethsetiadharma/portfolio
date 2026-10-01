import Image from "next/image";
import { DIE } from "./die-config";

// World-space height of the camera view at the die's distance.
const VIEW_HEIGHT =
  2 * DIE.camera.z * Math.tan((DIE.camera.fov / 2) * (Math.PI / 180));
// The live die is scaled to min(fit.max, canvasWidthUnits / fit.widthUnits), so on a narrow
// canvas it shrinks. This is the same rule in CSS units: the die is as tall as
// `frame` x min(box height, K x box width), where K converts width to the shrink point.
const K = VIEW_HEIGHT / (DIE.fit.widthUnits * DIE.fit.max);
const { frame, src, size } = DIE.staticDie;

// The static stand-in for the 3D die: a still render of the real die at its rest pose
// (K-forward). It is what you see first on every screen, and what stays for reduced motion,
// no WebGL, or a device too slow for the 3D scene. It is sized to line up with the live die.
// `cqh`/`cqw` are the hero visual box's own size (HeroCanvas makes it a size container).
export function HeroFallback({ onLoad }: { onLoad?: () => void }) {
  return (
    <div className="flex size-full items-center justify-center" aria-hidden>
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        unoptimized
        onLoad={onLoad}
        loading="eager"
        // It is the first thing painted (so the LCP element): fetch it at high priority.
        fetchPriority="high"
        // h-3/5 is the fallback for browsers without container query units.
        className="h-3/5 w-auto"
        style={{ height: `calc(${frame} * min(100cqh, ${K * 100}cqw))` }}
      />
    </div>
  );
}
