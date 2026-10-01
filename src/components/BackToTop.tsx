"use client";

import { ArrowUp } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Appears once you've scrolled past the hero. Smooth scrolling comes from the
// CSS in globals.css, so reduced-motion visitors get an instant jump.
export function BackToTop() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > 600));

  return (
    <motion.button
      type="button"
      aria-label="Back to top"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 12 }}
      transition={{ duration: 0.25 }}
      style={{ pointerEvents: show ? "auto" : "none" }}
      onClick={() => window.scrollTo({ top: 0 })}
      className={cn(
        buttonVariants({ size: "icon-lg" }),
        "fixed right-5 bottom-5 z-40 size-11 rounded-full shadow-lg",
      )}
    >
      <ArrowUp className="size-5" />
    </motion.button>
  );
}
