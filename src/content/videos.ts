// All video-editing projects live here. Each has exactly one of `youtubeId`
// (click-to-load YouTube embed) or `src` (local mp4 in public/videos/).
// Thumbnails go in public/images/videos/.

type VideoBase = {
  title: string;
  /** Still shown in the grid, e.g. "/images/videos/my-edit.jpg". */
  thumbnail: string;
};

export type VideoProject = VideoBase &
  (
    | { youtubeId: string; src?: never }
    | { src: string; youtubeId?: never }
  );

// Placeholder entries: replace with real edits.
export const videos: VideoProject[] = [
  {
    title: "SFU Kendo - Mask Off",
    thumbnail: "/images/videos/video-one.jpg",
    youtubeId: "-GYLVULkIys",
  },
  {
    title: "Video Two",
    thumbnail: "/images/videos/video-two.jpg",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    title: "Video Three",
    thumbnail: "/images/videos/video-three.jpg",
    youtubeId: "dQw4w9WgXcQ",
  },
];
