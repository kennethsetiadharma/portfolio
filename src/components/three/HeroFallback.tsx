import Image from "next/image";
import { DIE } from "./die-config";

// Static stand-in for the 3D die: shown on mobile, with reduced motion,
// during server render, and while the 3D chunk downloads. A silver die face
// showing the K, CSS only (the K reuses the same SVG as the 3D die).
export function HeroFallback() {
  return (
    <div className="flex size-full items-center justify-center" aria-hidden>
      <div className="flex aspect-square h-3/5 items-center justify-center rounded-[22%] bg-[linear-gradient(145deg,white_0%,oklch(0.85_0_0)_35%,oklch(0.55_0_0)_70%,oklch(0.88_0_0)_100%)] shadow-2xl">
        <div className="flex size-[82%] items-center justify-center rounded-[18%] bg-[linear-gradient(145deg,oklch(0.97_0_0),oklch(0.78_0_0))] shadow-[inset_0_2px_6px_rgb(255_255_255/0.8),inset_0_-3px_8px_rgb(0_0_0/0.18)]">
          <Image
            src={DIE.kSvg}
            alt=""
            width={100}
            height={120}
            className="h-[42%] w-auto"
          />
        </div>
      </div>
    </div>
  );
}
