"use client";

import dynamic from "next/dynamic";
import { useCanRender3D } from "@/hooks/use-can-render-3d";
import { HeroFallback } from "./HeroFallback";

// three.js lives in its own chunk and is only downloaded when HeroScene is
// actually rendered. ssr: false because WebGL only exists in the browser.
const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <HeroFallback />,
});

export function HeroCanvas({ className }: { className?: string }) {
  const canRender3D = useCanRender3D();

  return (
    <div className={className}>
      {canRender3D ? <HeroScene /> : <HeroFallback />}
    </div>
  );
}
