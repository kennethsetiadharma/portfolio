"use client";

import { useSyncExternalStore } from "react";

// 3D only renders on wider screens for users who haven't asked for reduced motion.
const QUERY = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

// The server can't know the screen size, so it always renders the fallback.
// React then swaps to the real value on the client without a hydration mismatch.
function getServerSnapshot() {
  return false;
}

export function useCanRender3D() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
