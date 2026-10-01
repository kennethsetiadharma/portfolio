import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { buttonVariants } from "@/components/ui/button";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/utils";

// Small pieces shared by the project card and its preview dialog.

export function ProjectTags({
  tags,
  className,
}: {
  tags: Project["tags"];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-full bg-black/5 px-3 py-1 text-xs text-foreground/70"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

// Buttons only render when their link is set.
export function ProjectLinks({
  github,
  live,
  className,
}: Pick<Project, "github" | "live"> & { className?: string }) {
  if (!github && !live) return null;
  const pill = cn(buttonVariants({ size: "lg" }), "rounded-full px-4");
  return (
    <div className={cn("flex gap-2", className)}>
      {live && (
        <a
          href={live}
          target="_blank"
          rel="noopener noreferrer"
          className={pill}
        >
          Live <ArrowUpRight className="size-4" />
        </a>
      )}
      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className={pill}
        >
          <GithubIcon className="size-4" /> Code
        </a>
      )}
    </div>
  );
}
