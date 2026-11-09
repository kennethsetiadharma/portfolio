import { ArrowUpRight, Trophy } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { YoutubeIcon } from "@/components/icons/YoutubeIcon";
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

// Accent badge for a hackathon win or similar. Renders nothing when unset.
export function ProjectAward({
  award,
  className,
}: {
  award: Project["award"];
  className?: string;
}) {
  if (!award) return null;
  return (
    <p
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-xs font-medium text-black",
        className,
      )}
    >
      <Trophy className="size-3.5" aria-hidden /> {award}
    </p>
  );
}

// Buttons only render when their link is set.
export function ProjectLinks({
  github,
  live,
  demo,
  devpost,
  note,
  className,
}: Pick<Project, "github" | "live" | "demo" | "devpost" | "note"> & {
  className?: string;
}) {
  if (!github && !live && !demo && !devpost && !note) return null;
  const pill = cn(buttonVariants({ size: "lg" }), "rounded-full px-4");
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
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
      {demo && (
        <a
          href={demo}
          target="_blank"
          rel="noopener noreferrer"
          className={pill}
        >
          <YoutubeIcon className="size-4" /> Demo
        </a>
      )}
      {devpost && (
        <a
          href={devpost}
          target="_blank"
          rel="noopener noreferrer"
          className={pill}
        >
          Devpost <ArrowUpRight className="size-4" />
        </a>
      )}
      {note && <p className="text-sm text-muted-foreground">{note}</p>}
    </div>
  );
}
