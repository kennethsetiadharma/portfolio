import { HeroCanvas } from "@/components/three/HeroCanvas";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Section } from "@/components/Section";
import { SocialLinks } from "@/components/SocialLinks";
import { site } from "@/content/site";

// Temporary test page: proves the 3D pipeline and shared pieces work. Real sections come later.
export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <HeroCanvas className="h-[45vh] w-full max-w-xl" />
        <h1 className="text-center text-[clamp(3rem,12vw,10rem)] font-medium leading-none tracking-tighter">
          {site.name}
        </h1>
      </div>
      <Section id="demo" title="Shared pieces demo">
        <Reveal>
          <SocialLinks />
        </Reveal>
        <Stagger className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {["One", "Two", "Three"].map((n) => (
            <StaggerItem key={n} className="h-40 rounded-2xl bg-muted p-6">
              {n}
            </StaggerItem>
          ))}
        </Stagger>
      </Section>
    </main>
  );
}
