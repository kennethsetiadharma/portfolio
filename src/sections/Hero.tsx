import { HeroVisual } from "@/components/three/HeroVisual";
import { SocialLinks } from "@/components/SocialLinks";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-12 text-center">
      <HeroVisual className="h-[44vh] w-full max-w-xl" />
      <h1 className="text-[clamp(3rem,9.5vw,9rem)] font-medium leading-none tracking-tighter">
        {site.name}
      </h1>
      <p className="mt-6 max-w-md text-lg text-muted-foreground">
        {site.intro}
      </p>
      <p className="mt-2 text-muted-foreground">{site.location}</p>
      <a
        href={site.links.email}
        className="mt-1 text-muted-foreground transition-colors hover:text-foreground"
      >
        {site.email}
      </a>
      <SocialLinks className="mt-8" />
    </section>
  );
}
