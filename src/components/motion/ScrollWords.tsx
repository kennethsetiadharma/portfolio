"use client";

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef, type ReactNode } from "react";

// Share of the scroll over which the words light up; the rest is a short hold
// with the whole sentence lit before the section lets go.
const REVEAL_END = 0.85;
// Opacity of a word before it lights up. 0.47 is the lowest that still passes
// contrast for large text (3:1) on the page background; lower looks more
// dramatic but fails the accessibility audit.
const DIM = 0.47;

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [DIM, 1]);
  // Reduced motion is handled in CSS (not a hook) so server and client markup match.
  return (
    <motion.span className="motion-reduce:opacity-100!" style={{ opacity }}>
      {children}{" "}
    </motion.span>
  );
}

// A sentence that lights up word by word as you scroll through it. The content
// pins to the screen while that happens (the track is two screens tall).
// Reduced motion: no pinning, every word fully visible.
// `media` sits beside the sentence, `children` under it.
export function ScrollWords({
  text,
  media,
  children,
}: {
  text: string;
  media?: ReactNode;
  children?: ReactNode;
}) {
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start 0.5", "end end"],
  });
  const words = text.split(" ");

  return (
    <div ref={track} className="motion-safe:h-[200vh] md:motion-safe:h-[220vh]">
      <div className="mx-auto flex w-full max-w-6xl items-center px-6 py-24 motion-safe:sticky motion-safe:top-0 motion-safe:h-svh motion-safe:py-0 md:py-36">
        <div className="grid items-center gap-10 md:grid-cols-[16rem_minmax(0,1fr)] md:gap-16">
          {media}
          <div>
            <p className="text-[clamp(2rem,4.6vw,4.25rem)] leading-[1.05] font-medium tracking-tighter">
              {words.map((word, i) => (
                <Word
                  key={i}
                  progress={scrollYProgress}
                  range={[
                    (i / words.length) * REVEAL_END,
                    ((i + 1) / words.length) * REVEAL_END,
                  ]}
                >
                  {word}
                </Word>
              ))}
            </p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
