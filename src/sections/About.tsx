import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/Section";
import { site } from "@/content/site";

export function About() {
  const { photo, photoAlt, text } = site.about;

  return (
    <Section id="about" title="About">
      <div className="grid items-center gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-16">
        <Reveal>
          <Image
            src={photo}
            alt={photoAlt}
            width={800}
            height={1000}
            sizes="(min-width: 768px) 40vw, 100vw"
            className="mx-auto aspect-[4/5] w-full max-w-[15rem] rounded-3xl object-cover md:mx-0 md:max-w-sm"
          />
        </Reveal>
        <Reveal delay={0.1} className="space-y-5">
          {text.map((paragraph) => (
            <p
              key={paragraph}
              className="text-xl leading-snug tracking-tight text-foreground/80 md:text-2xl"
            >
              {paragraph}
            </p>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
