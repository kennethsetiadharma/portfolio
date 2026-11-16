// All project data lives here. To add a project, append an object to `projects`
// and drop its media into public/videos/. Never edit components to add a project.

export type Project = {
  title: string;
  /** The big line: what it does for someone, in a few words. Falls back to the title. */
  headline?: string;
  /** One or two sentences. Keep it short. */
  description: string;
  /** Your part in it, e.g. "One of 3 developers". Leave undefined to hide. */
  role?: string;
  /** What came of it, e.g. a result or number. Leave undefined to hide. */
  outcome?: string;
  /** 2–4 tags. */
  tags: string[];
  /** Short, muted, looping clip that plays when the project scrolls into view, e.g. "/videos/my-project.mp4". */
  video?: string;
  /** 16:9 still shown before the clip loads, or instead of it, e.g. "/videos/my-project.jpg". */
  poster: string;
  /** Leave undefined to hide the button. */
  github?: string;
  /** Leave undefined to hide the button. */
  live?: string;
  /** Full YouTube demo URL. Leave undefined to hide the button. */
  demo?: string;
  /** Devpost (hackathon) page URL. Leave undefined to hide the button. */
  devpost?: string;
  /** Short award line shown as an accent badge, e.g. "Winner · Some Hackathon 2026". */
  award?: string;
  /** Short muted line shown with the links, e.g. "Code available on request". */
  note?: string;
  /** Keep the entry in this file but don't show it on the site (e.g. until its links are ready). */
  hidden?: boolean;
};

// `headline`, `role` and `outcome` below are drafts written from the READMEs:
// search for "TODO confirm" and edit or delete each one.
export const projects: Project[] = [
  {
    title: "FridgeMates",
    headline: "Your whole fridge, logged from one photo.", // TODO confirm
    role: "One of 3 developers, built at SFU Fall Hacks 2026", // TODO confirm: say which part was yours
    description: "An iPhone app that logs your whole fridge from one photo. Gemini identifies and counts each item and estimates expiry dates, so you know what to eat first.",
    tags: ["React Native", "Expo", "TypeScript", "Gemini"],
    poster: "/videos/fridgemates-thumbnail.jpg",
    github: "https://github.com/Rainier-Ordinario/FridgeMates",
    demo: "https://www.youtube.com/watch?v=XU6VGoLsIII",
    devpost: "https://devpost.com/software/fridgemates",
    award: "SURGE Prize Track Winner · Fall Hacks 2026",
    // No live link: it is a native iPhone app.
  },
  {
    title: "Virus Breach",
    headline: "Break in, grab the key, get out.", // TODO confirm
    role: "One of 4 developers, CMPT 276 at SFU", // TODO confirm: say which part was yours
    outcome: "Unit-tested with JUnit, coverage tracked with JaCoCo", // TODO confirm
    description: "A 2D tile-based hacking game built with JavaFX. Navigate the board, collect data, find the decryption key, and escape through the exit while avoiding firewalls and the antivirus enemy.",
    tags: ["Java", "Maven", "JavaFX"],
    video: "/videos/virusbreach-demo.mp4",
    poster: "/videos/virusbreach-thumbnail.jpg",
    github: "https://github.com/kennethsetiadharma/virus-breach",
    demo: "https://www.youtube.com/watch?v=TR7ZeQVZClo",
    // No live link: it is a desktop game.
  },
  {
    title: "Real-Time ASL Hand Gesture Detector",
    headline: "Reads hand signs live from a webcam.", // TODO confirm
    description: "A real-time hand gesture recognition system using Python, OpenCV, cvzone, and TensorFlow/Keras.",
    // TODO role / outcome: I had nothing to draft these from (solo or team? accuracy? number of signs?).
    tags: ["Python", "OpenCV", "cvzone", "TensorFlow/Keras"],
    video: "/videos/aslgesturedemo.mp4",
    poster: "/videos/aslgesturedemo-poster.jpg",
    note: "Code available on request",
    // TODO github: add the repo URL (Code button appears automatically once set), then drop the note.
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
