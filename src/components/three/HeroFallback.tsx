import Image from "next/image";
import { DIE } from "./die-config";

// The static stand-in for the 3D die. It is what you see first on every screen,
// and what stays for reduced motion, no WebGL, or a device too slow for the 3D scene.
// It is your gradient K logo (an SVG, so it stays sharp at any size).
export function HeroFallback() {
  return (
    <div className="flex size-full items-center justify-center" aria-hidden>
      <Image
        src={DIE.staticLogo}
        alt=""
        width={187}
        height={187}
        loading="eager"
        className="h-3/5 w-auto"
      />
    </div>
  );
}
