"use client";

import Image from "next/image";
import { Expand, Play } from "lucide-react";
import { useReducedMotion } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProjectLinks, ProjectTags } from "@/components/ProjectMeta";
import { ThumbTrigger } from "@/components/ThumbTrigger";
import type { Project } from "@/content/projects";

// The card thumbnail is a static poster. Clicking it opens a focused lightbox
// with the demo clip and a short description. The clip only exists (and only
// downloads) while the dialog is open.
export function ProjectDialog({ project }: { project: Project }) {
  const { title, description, tags, video, poster, github, live } = project;
  const reduceMotion = useReducedMotion();

  return (
    <Dialog>
      <ThumbTrigger
        label={`Open ${title}`}
        poster={poster}
        width={1280}
        height={800}
        aspectClass="aspect-[16/10]"
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        Icon={video ? Play : Expand}
      />

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
