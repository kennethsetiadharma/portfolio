// Personal details shown across the page.
// Edit this file to change your name, intro, links, about text, or nav: no component changes needed.

export const site = {
  name: "Your Name",
  intro: "CS student building things for the web.",
  links: {
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/",
    email: "mailto:you@example.com",
    resume: "/resume.pdf",
  },
  nav: [
    { label: "About", href: "#about" },
    { label: "Work", href: "#work" },
    { label: "Videos", href: "#videos" },
  ],
  about: {
    photo: "/images/me.jpg",
    photoAlt: "Portrait of Your Name",
    text: [
      "I'm a computer science student who likes building clean, fast things for the web.",
      "Outside of code, I edit videos and tinker with 3D.",
    ],
  },
  contact: "Want to work together? Say hello.",
} as const;
