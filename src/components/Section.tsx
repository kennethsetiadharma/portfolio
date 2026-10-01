import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";

// Page section with a consistent width, generous spacing, and an optional heading.
// `id` is the scroll target for the nav.
export function Section({
  id,
  title,
  className,
  children,
}: {
  id?: string;
  title?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24 md:py-32", className)}
    >
      {title && (
        <Reveal>
          <h2 className="mb-12 text-3xl font-medium tracking-tighter md:text-4xl">
            {title}
          </h2>
        </Reveal>
      )}
      {children}
    </section>
  );
}
