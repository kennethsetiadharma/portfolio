// Personal details shown across the page.
// Edit this file to change your name, intro, links, about text, or nav: no component changes needed.

const email = "kenneth.setiadharma@gmail.com";

export const site = {
  name: "Kenneth Setiadharma",
  // TODO confirm: drafted line, edit freely.
  intro: "CS student at SFU. I build apps and cut films.",
  /** Shown under the intro in the hero. */
  location: "Based in Burnaby, BC",
  /** Hero showreel: a short muted clip and its first frame. Replace both files to change it. */
  hero: {
    reel: "/videos/reel.mp4",
    poster: "/videos/reel-poster.webp",
  },
  /** Shown as text in the footer; the mailto link below is built from it. */
  email,
  links: {
    github: "https://github.com/kennethsetiadharma",
    linkedin: "https://www.linkedin.com/in/kennethsetiadharma/",
    email: `mailto:${email}`,
    resume: "/Kenneth Setiadharma Resume - Oct 2026.pdf",
  },
  nav: [
    { label: "About", href: "#about" },
    { label: "Work", href: "#work" },
    { label: "Videos", href: "#videos" },
  ],
  about: {
    photo: "/images/kenneth.JPG",
    photoAlt: "Portrait of Kenneth Setiadharma",
    text: [
      "A CS student building fast and cool things for the web",
      "Outside of code, I film and edit videos.",
    ],
  },
  /** Section headings: a small label over a large statement. */
  sections: {
    work: { eyebrow: "Work", title: "Things I’ve built." },
    videos: { eyebrow: "Videos", title: "Things I’ve cut." },
  },
  contact: "Want to work together? Say hello.",
} as const;
