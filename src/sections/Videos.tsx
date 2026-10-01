import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Section } from "@/components/Section";
import { VideoCard } from "@/components/VideoCard";
import { videos } from "@/content/videos";

export function Videos() {
  return (
    <Section id="videos" title="Videos">
      <Stagger className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {videos
          .filter((video) => !video.hidden)
          .map((video) => (
            <StaggerItem key={video.title}>
              <VideoCard video={video} />
            </StaggerItem>
          ))}
      </Stagger>
    </Section>
  );
}
