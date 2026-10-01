"use client";

import { useEffect, useState } from "react";

// Becomes true once the browser has a quiet moment after first render (or after
// `timeout` ms at most). Lets heavy, non-urgent work stay off the critical path.
export function useIdle(timeout = 2000) {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    const done = () => setIdle(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(done, { timeout });
      return () => window.cancelIdleCallback(id);
    }
    // Safari has no requestIdleCallback.
    const id = window.setTimeout(done, 300);
    return () => window.clearTimeout(id);
  }, [timeout]);
  return idle;
}
