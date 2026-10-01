"use client";

import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Static thumbnail that opens a dialog. Zooms slightly on hover and shows a round
// badge; the badge is always visible on touch screens, which have no hover.
// Must be rendered inside a <Dialog>.
export function ThumbTrigger({
  label,
  poster,
  width,
  height,
  aspectClass,
  sizes,
  Icon,
}: {
  label: string;
  poster: string;
  width: number;
  height: number;
  /** e.g. "aspect-video". Written out at the call site so Tailwind sees it. */
  aspectClass: string;
  sizes: string;
  Icon: LucideIcon;
}) {
  return (
    <DialogTrigger
      aria-label={label}
      className={cn(
        "group relative block w-full cursor-pointer overflow-hidden rounded-2xl bg-muted text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        aspectClass,
      )}
    >
      <Image
        src={poster}
        alt=""
        width={width}
        height={height}
        sizes={sizes}
        className="size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
      <span className="absolute right-3 bottom-3 flex size-10 translate-y-1 items-center justify-center rounded-full bg-black/75 text-white opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 pointer-coarse:translate-y-0 pointer-coarse:opacity-100 motion-reduce:transition-none">
        <Icon className="size-4" />
      </span>
    </DialogTrigger>
  );
}
