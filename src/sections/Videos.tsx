import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Section } from "@/components/Section";
import { VideoCard } from "@/components/VideoCard";
import { site } from "@/content/site";
import { videos } from "@/content/videos";

// The first visible video is the large feature; any others sit in a grid under it.
export function Videos() {
  const [feature, ...rest] = videos.filter((video) => !video.hidden);
  if (!feature) return null;

  return (
    <Section id="videos" tone="dark" {...site.sections.videos}>
      <Reveal>
        <VideoCard video={feature} feature />
      </Reveal>
      {rest.length > 0 && (
        <Stagger className="mt-16 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((video) => (
            <StaggerItem key={video.title}>
              <VideoCard video={video} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </Section>
  );
}
