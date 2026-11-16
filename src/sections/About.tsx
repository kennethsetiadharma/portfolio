import Image from "next/image";
import { ScrollWords } from "@/components/motion/ScrollWords";
import { site } from "@/content/site";

export function About() {
  const { photo, photoAlt, statement, facts } = site.about;

  return (
    <section id="about">
      <ScrollWords
        text={statement}
        media={
          <Image
            src={photo}
            alt={photoAlt}
            width={640}
            height={800}
            sizes="16rem"
            className="aspect-[4/5] w-40 rounded-3xl object-cover md:w-full"
          />
        }
      >
        {facts.length > 0 && (
          <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-4">
            {facts.map(({ label, value }) => (
              <div key={label}>
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="mt-1 text-lg font-medium tracking-tight">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </ScrollWords>
    </section>
  );
}
