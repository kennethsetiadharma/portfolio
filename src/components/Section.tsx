import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";

// Page section with a consistent width and generous spacing. `id` is the scroll
// target for the nav. The heading is a small `eyebrow` label over a large `title`
// statement. `tone="dark"` gives a full-width near-black band (see `.section-dark`).
export function Section({
  id,
  eyebrow,
  title,
  tone = "light",
  className,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  tone?: "light" | "dark";
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24", tone === "dark" && "section-dark")}>
      <div className={cn("mx-auto w-full max-w-6xl px-6 py-24 md:py-36", className)}>
        {(eyebrow || title) && (
          <Reveal className="mb-14 md:mb-20">
            {eyebrow && (
              <p className="mb-4 text-sm font-medium text-muted-foreground">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-[clamp(2.5rem,6vw,5rem)] leading-none font-medium tracking-tighter">
                {title}
              </h2>
            )}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
