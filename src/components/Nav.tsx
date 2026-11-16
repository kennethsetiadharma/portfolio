"use client";

import { House } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { site } from "@/content/site";

const linkClass =
  "relative block rounded-full px-4 py-1.5 text-sm font-medium text-white/70 transition-colors outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 aria-[current]:text-white";

// The highlight behind the current link. One shared `layoutId`, so it slides
// from link to link instead of jumping.
function ActivePill() {
  return (
    <motion.span
      layoutId="nav-active"
      className="absolute inset-0 rounded-full bg-white/15"
      transition={{ type: "spring", stiffness: 400, damping: 34 }}
    />
  );
}

// Floating dark glass pill, centred at the top; it reads over both the light
// and the dark sections. Home (the house icon) scrolls back to the top, the
// other links come from `site.nav`, and the section crossing the middle of the
// screen is highlighted.
export function Nav() {
  const [active, setActive] = useState("#");

  useEffect(() => {
    // The hero (first section in <main>) counts as Home.
    const hero = document.querySelector("main > section");
    const sections = site.nav
      .map(({ href }) => document.querySelector(href))
      .filter((el): el is Element => el !== null);
    const inView = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inView.add(entry.target);
          else inView.delete(entry.target);
        }
        // Sections don't overlap, so at most one crosses the middle line. When
        // none does (the footer), the highlight stays on the last one.
        const [current] = inView;
        if (current) setActive(current === hero ? "#" : `#${current.id}`);
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    if (hero) observer.observe(hero);
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <ul className="flex items-center gap-1 rounded-full border border-white/10 bg-neutral-900/75 p-1 shadow-lg shadow-black/10 backdrop-blur-md">
        <li>
          <a
            href="#"
            aria-label="Home, back to top"
            aria-current={active === "#" ? "true" : undefined}
            className={linkClass}
          >
            {active === "#" && <ActivePill />}
            <House className="relative size-4" />
          </a>
        </li>
        {site.nav.map(({ label, href }) => (
          <li key={href}>
            <a
              href={href}
              aria-current={active === href ? "true" : undefined}
              className={linkClass}
            >
              {active === href && <ActivePill />}
              <span className="relative">{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
