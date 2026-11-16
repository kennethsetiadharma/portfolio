import { HeroReel } from "@/components/HeroReel";
import { SocialLinks } from "@/components/SocialLinks";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section>
      <div className="flex flex-col items-center px-6 pt-32 text-center md:pt-36">
        <h1 className="text-[clamp(3rem,9.5vw,9rem)] leading-none font-medium tracking-tighter">
          {site.name}
        </h1>
        <p className="mt-6 max-w-md text-lg text-foreground/80 md:text-xl">
          {site.intro}
        </p>
        <p className="mt-2 text-muted-foreground">{site.location}</p>
        <SocialLinks className="mt-8" />
      </div>
      <HeroReel src={site.hero.reel} poster={site.hero.poster} />
    </section>
  );
}
