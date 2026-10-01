import { About } from "@/sections/About";
import { Hero } from "@/sections/Hero";
import { Projects } from "@/sections/Projects";
import { Videos } from "@/sections/Videos";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <About />
      <Projects />
      <Videos />
    </main>
  );
}
