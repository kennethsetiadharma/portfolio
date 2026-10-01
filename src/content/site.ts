// Personal details shown across the page.
// Edit this file to change your name, intro, links, about text, or nav: no component changes needed.

const email = "kenneth.setiadharma@gmail.com";

export const site = {
  name: "Kenneth Setiadharma",
  intro: "CS student building things for the web.",
  /** Shown under the intro in the hero. */
  location: "Based in Burnaby, BC",
  /** Shown as text in the footer; the mailto link below is built from it. */
  email,
  links: {
    github: "https://github.com/kennethsetiadharma",
    linkedin: "https://www.linkedin.com/in/kenneth-setiadharma-812826289/",
    email: `mailto:${email}`,
    resume: "/Kenneth Setiadharma Technical Resume.pdf",
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
      "I'm a 3rd year computer science student at SFU who likes building clean, fast things for the web.",
      "Outside of code, I film and edit videos.",
    ],
  },
  contact: "Want to work together? Say hello.",
} as const;
