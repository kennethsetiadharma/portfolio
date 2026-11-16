"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";

type SaveDataNavigator = Navigator & { connection?: { saveData?: boolean } };

// A project's media. It always shows the poster. If there is a clip, the <video>
// mounts (and starts downloading) only when the frame scrolls into view, plays
// muted on a loop, and pauses whenever it leaves the screen.
// Reduced motion or data saver: nothing autoplays; a play button mounts the clip
// with normal controls instead.
export function InViewClip({
  video,
  poster,
  title,
}: {
  video?: string;
  poster: string;
  title: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  // "auto" = playing because it is in view; "manual" = the visitor pressed play.
  const [mode, setMode] = useState<"idle" | "auto" | "manual">("idle");
  const [askFirst, setAskFirst] = useState(false);

  return (
    <motion.div
      className="relative aspect-video overflow-hidden rounded-3xl bg-muted"
      viewport={{ amount: 0.4 }}
      onViewportEnter={() => {
        if (!video || mode === "manual") return;
        const saveData = (navigator as SaveDataNavigator).connection?.saveData;
        if (reduceMotion || saveData) setAskFirst(true);
        else if (mode === "idle") setMode("auto");
        else ref.current?.play().catch(() => {});
      }}
      onViewportLeave={() => ref.current?.pause()}
    >
      <Image
        src={poster}
        alt={video ? "" : `${title} preview`}
        width={1280}
        height={720}
        sizes="(min-width: 768px) 58vw, 100vw"
        className="size-full object-cover"
      />
      {video && mode !== "idle" && (
        <video
          ref={ref}
          src={video}
          poster={poster}
          aria-label={`${title} demo`}
          muted
          playsInline
          autoPlay
          loop={mode === "auto"}
          controls={mode === "manual"}
          className="absolute inset-0 size-full object-cover"
        />
      )}
      {video && askFirst && mode === "idle" && (
        <button
          type="button"
          onClick={() => setMode("manual")}
          aria-label={`Play ${title} demo`}
          className="absolute right-4 bottom-4 flex size-11 items-center justify-center rounded-full bg-black/70 text-white transition-colors outline-none hover:bg-black focus-visible:ring-3 focus-visible:ring-white/60"
        >
          <Play className="size-4" />
        </button>
      )}
    </motion.div>
  );
}
