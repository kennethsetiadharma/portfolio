import { Section } from "@/components/Section";
import { About } from "@/sections/About";
import { Hero } from "@/sections/Hero";
import { Projects } from "@/sections/Projects";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <About />
      <Projects />
      {/* Temporary placeholders (page order) until item 7 and the footer ship. */}
      {["videos"].map((id) => (
        <Section key={id} id={id} title={id} className="min-h-screen" />
      ))}
    </main>
  );
}
