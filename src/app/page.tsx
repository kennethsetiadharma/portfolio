import { Section } from "@/components/Section";
import { About } from "@/sections/About";
import { Hero } from "@/sections/Hero";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <About />
      {/* Temporary placeholders (page order) until items 6-7 and the footer ship. */}
      {["work", "videos"].map((id) => (
        <Section key={id} id={id} title={id} className="min-h-screen" />
      ))}
    </main>
  );
}
