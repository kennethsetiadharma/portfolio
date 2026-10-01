"use client";

import Image from "next/image";
import { Expand, Play } from "lucide-react";
import { useReducedMotion } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProjectLinks, ProjectTags } from "@/components/ProjectMeta";
import type { Project } from "@/content/projects";

// The card thumbnail is a static poster. Clicking it opens a focused lightbox
// with the demo clip and a short description. The clip only exists (and only
// downloads) while the dialog is open.
export function ProjectDialog({ project }: { project: Project }) {
  const { title, description, tags, video, poster, github, live } = project;
  const reduceMotion = useReducedMotion();
  const BadgeIcon = video ? Play : Expand;

  return (
    <Dialog>
      <DialogTrigger
        aria-label={`Open ${title}`}
        className="group relative block aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-2xl bg-muted text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Image
          src={poster}
          alt=""
          width={1280}
          height={800}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        {/* Hover/focus cue. Always visible on touch screens, which have no hover. */}
        <span className="absolute right-3 bottom-3 flex size-10 translate-y-1 items-center justify-center rounded-full bg-black/75 text-white opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 pointer-coarse:translate-y-0 pointer-coarse:opacity-100 motion-reduce:transition-none">
          <BadgeIcon className="size-4" />
        </span>
      </DialogTrigger>

      <DialogContent>
        <div className="aspect-video bg-black">
          {video ? (
            <video
              src={video}
              poster={poster}
              aria-label={`${title} demo`}
              muted
              loop
              playsInline
              // Reduced motion: no autoplay, show controls so they can opt in.
              autoPlay={!reduceMotion}
              controls={!!reduceMotion}
              className="size-full object-contain"
            />
          ) : (
            <Image
              src={poster}
              alt={`${title} preview`}
              width={1280}
              height={800}
              sizes="(min-width: 896px) 896px, 100vw"
              className="size-full object-cover"
            />
          )}
        </div>
        <div className="space-y-4 p-6 md:p-8">
          <div className="space-y-2">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </div>
          <ProjectTags tags={tags} />
          <ProjectLinks github={github} live={live} className="pt-2" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
