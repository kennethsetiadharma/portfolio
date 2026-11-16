"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

type SaveDataNavigator = Navigator & { connection?: { saveData?: boolean } };

// The hero showreel. It starts as a rounded frame peeking above the fold and
// grows to full-bleed as you scroll (sizes and pinning are in globals.css under
// `.reel-track` / `.reel-frame`, driven by the `--p` scroll progress set here).
//
// Loading order (keep it): the poster image comes first, at high priority. The
// video only mounts, and so only starts downloading, once the poster has loaded.
// It never mounts for reduced motion or data-saver visitors, who keep the poster.
export function HeroReel({ src, poster }: { src: string; poster: string }) {
  const track = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(track);
  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);

  // 0 when the frame's top is 65% down the screen, 1 when it reaches the top.
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start 0.65", "start start"],
  });

  // Don't decode video nobody can see.
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (inView && !paused) el.play().catch(() => {});
    else el.pause();
  }, [inView, paused, mounted]);

  return (
    <div ref={track} className="reel-track mt-14 md:mt-20">
      <motion.div
        className="reel-frame relative overflow-hidden bg-neutral-900"
        style={{ "--p": scrollYProgress } as React.CSSProperties}
      >
        <Image
          src={poster}
          alt=""
          width={1280}
          height={720}
          // Served as the static file, like any LCP image here: going through the
          // image optimizer made the first paint later (simulated mobile LCP 3.1 s vs 2.3 s).
          unoptimized
          loading="eager"
          fetchPriority="high"
          onLoad={() => {
            const saveData = (navigator as SaveDataNavigator).connection?.saveData;
            if (!reduceMotion && !saveData) setMounted(true);
          }}
          className="absolute inset-0 size-full object-cover"
        />
        {mounted && (
          <>
            <video
              ref={video}
              src={src}
              aria-label="Showreel of recent work"
              muted
              loop
              playsInline
              autoPlay
              onPlaying={() => setPlaying(true)}
              className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${playing ? "opacity-100" : "opacity-0"}`}
            />
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Play showreel" : "Pause showreel"}
              className="absolute right-4 bottom-4 flex size-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors outline-none hover:bg-black/80 focus-visible:ring-3 focus-visible:ring-white/60"
            >
              {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
