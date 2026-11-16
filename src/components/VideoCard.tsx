"use client";

import { Play } from "lucide-react";
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ThumbTrigger } from "@/components/ThumbTrigger";
import { VideoPlayer } from "@/components/VideoPlayer";
import type { VideoProject } from "@/content/videos";

// Static thumbnail in the grid; clicking opens a focused lightbox with the player.
// `feature` is the large version used for the first video in the section.
export function VideoCard({ video, feature }: { video: VideoProject; feature?: boolean }) {
  const { title, thumbnail } = video;

  return (
    <Dialog>
      <ThumbTrigger
        label={`Play ${title}`}
        poster={thumbnail}
        width={1280}
        height={720}
        aspectClass="aspect-video"
        sizes={
          feature
            ? "(min-width: 1152px) 1104px, 100vw"
            : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        }
        Icon={Play}
        feature={feature}
      />
      <p
        className={
          feature
            ? "mt-6 text-2xl font-medium tracking-tight md:text-3xl"
            : "mt-4 text-lg font-medium tracking-tight"
        }
      >
        {title}
      </p>

      {/* The X sits in the title row, not over the player: embeds put their own
          controls in the top-right corner. */}
      <DialogContent overlayClose={false}>
        <div className="aspect-video bg-black">
          <VideoPlayer video={video} />
        </div>
        <div className="flex items-center justify-between gap-4 p-6 md:p-8">
          <DialogTitle>{title}</DialogTitle>
          <DialogCloseButton className="shrink-0" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
