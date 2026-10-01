import { Reveal } from "@/components/motion/Reveal";
import { SocialLinks } from "@/components/SocialLinks";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-6 pt-24 pb-12 text-center md:pt-32">
      <Reveal className="flex flex-col items-center gap-10">
        <a
          href={site.links.email}
          className="text-3xl leading-tight font-medium tracking-tighter underline-offset-8 hover:underline md:text-5xl"
        >
          {site.contact}
        </a>
        <SocialLinks />
      </Reveal>
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} {site.name}
      </p>
    </footer>
  );
}
