import { Reveal } from "@/components/motion/Reveal";
import { SocialLinks } from "@/components/SocialLinks";
import { site } from "@/content/site";

// Dark, so it runs on from the Videos section above it.
export function Footer() {
  return (
    <footer className="section-dark">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-6 pt-24 pb-12 text-center md:pt-36">
        <Reveal className="flex flex-col items-center gap-10">
          <a
            href={site.links.email}
            className="text-[clamp(2.5rem,6vw,5rem)] leading-none font-medium tracking-tighter text-balance underline-offset-8 hover:underline"
          >
            {site.contact}
          </a>
          <SocialLinks />
          <a
            href={site.links.email}
            className="text-lg text-muted-foreground transition-colors hover:text-foreground"
          >
            {site.email}
          </a>
        </Reveal>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
