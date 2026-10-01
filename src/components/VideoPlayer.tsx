import type { VideoProject } from "@/content/videos";

// Only ever rendered inside an open dialog, so nothing loads before a click.
// YouTube uses the privacy-enhanced domain; mp4s get normal controls and sound,
// since the viewer chose to play them.
export function VideoPlayer({ video }: { video: VideoProject }) {
  const { youtubeId, src, thumbnail, title } = video;

  if (youtubeId) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className="size-full border-0"
      />
    );
  }

  return (
    <video
      src={src}
      poster={thumbnail}
      aria-label={title}
      controls
      autoPlay
      playsInline
      className="size-full object-contain"
    />
  );
}
