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
};

// Placeholder entries: replace with real projects.
export const projects: Project[] = [
  {
    title: "Project One",
    description: "A short line about what this project does.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    poster: "/videos/project-one.jpg",
    github: "https://github.com/",
    live: "https://example.com",
  },
  {
    title: "Project Two",
    description: "A short line about what this project does.",
    tags: ["Python", "FastAPI"],
    poster: "/videos/project-two.jpg",
    github: "https://github.com/",
  },
  {
    title: "Project Three",
    description: "A short line about what this project does.",
    tags: ["React", "Three.js"],
    poster: "/videos/project-three.jpg",
    live: "https://example.com",
  },
];
