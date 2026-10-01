import { HeroVisual } from "@/components/three/HeroVisual";
import { SocialLinks } from "@/components/SocialLinks";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-12 text-center">
      <HeroVisual className="h-[44vh] w-full max-w-xl" />
      <h1 className="text-[clamp(3rem,12vw,10rem)] font-medium leading-none tracking-tighter">
        {site.name}
      </h1>
      <p className="mt-6 max-w-md text-lg text-muted-foreground">
        {site.intro}
      </p>
      <SocialLinks className="mt-8" />
    </section>
  );
}
