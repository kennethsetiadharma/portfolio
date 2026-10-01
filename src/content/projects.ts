// All project data lives here. To add a project, append an object to `projects`
// and drop its media into public/videos/. Never edit components to add a project.

export type Project = {
  title: string;
  /** One line. Keep it short. */
  description: string;
  /** 2–4 tags. */
  tags: string[];
  /** Short, muted, looping clip, e.g. "/videos/my-project.mp4". */
  video?: string;
  /** Still frame shown before the video loads, or instead of it, e.g. "/videos/my-project.jpg". */
  poster: string;
  /** Leave undefined to hide the button. */
  github?: string;
  /** Leave undefined to hide the button. */
  live?: string;
  /** Keep the entry in this file but don't show it on the site (e.g. until its links are ready). */
  hidden?: boolean;
};

// Placeholder entries: replace with real projects.
export const projects: Project[] = [
  {
    title: "Virus Breach",
    description: "A 2D tile-based hacking game built with JavaFX. Navigate the board, collect data, find the decryption key, and escape through the exit while avoiding firewalls and the antivirus enemy.",
    tags: ["Java", "Maven", "JavaFX"],
    video: "/videos/virusbreach-demo.mp4",
    poster: "/videos/virusbreach-thumbnail.jpg",
    // TODO github: the repo is on SFU's private server (github.sfu.ca), so visitors can't open it.
    //   Add a link once it is copied to github.com (if the course and teammates allow), or leave it off.
    // No live link: it is a desktop game.
  },
  {
    title: "Real-Time ASL Hand Gesture Detector",
    description: "A real-time hand gesture recognition system using Python, OpenCV, cvzone, and TensorFlow/Keras",
    tags: ["Python", "OpenCV", "cvzone", "TensorFlow/Keras"],
    video: "/videos/aslgesturedemo.mp4",
    poster: "/videos/aslgesturedemo-poster.jpg",
    // TODO github: add the repo URL (Code button appears automatically once set).
  },
  {
    title: "Group Consensus App",
    description: "A short line about what this project does.",
    tags: ["React", "Expo", "Supabase"],
    poster: "/videos/project-three.jpg",
    // TODO: real description, poster/demo clip, and live/github links.
    live: "https://example.com",
    hidden: true, // placeholder content: delete this line once the entry is ready
  },
];
