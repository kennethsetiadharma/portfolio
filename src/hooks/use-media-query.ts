"use client";

import { useSyncExternalStore } from "react";

// Live value of a CSS media query. The server can't know the answer, so it
// reports false; React swaps in the real value on the client without a hydration mismatch.
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
