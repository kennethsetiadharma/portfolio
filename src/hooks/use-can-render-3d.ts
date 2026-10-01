"use client";

import { useSyncExternalStore } from "react";
import { useMediaQuery } from "./use-media-query";

// Checked once, then cached: creating a WebGL context isn't free. The test
// context is released straight away so it doesn't count against the browser's limit.
let webglSupported: boolean | undefined;
function hasWebGL() {
  if (webglSupported === undefined) {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      webglSupported = !!gl;
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      webglSupported = false;
    }
  }
  return webglSupported;
}

const noSubscribe = () => () => {};

// The 3D die runs on every screen size, except for visitors who ask for reduced
// motion or whose browser has no WebGL. They keep the static HeroFallback.
export function useCanRender3D() {
  const motionOk = useMediaQuery("(prefers-reduced-motion: no-preference)");
  const webgl = useSyncExternalStore(noSubscribe, hasWebGL, () => false);
  return motionOk && webgl;
}
