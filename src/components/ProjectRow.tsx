import { InViewClip } from "@/components/InViewClip";
import { ProjectAward, ProjectLinks, ProjectTags } from "@/components/ProjectMeta";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/utils";

// One project across the full width: media on one side, the story on the other.
// `flip` puts the media on the right (the Work section alternates it).
// All data comes from a Project in src/content/projects.ts.
export function ProjectRow({ project, flip }: { project: Project; flip?: boolean }) {
  const { title, headline, description, role, outcome, tags, video, poster, github, live, demo, devpost, award, note } = project;
  const facts = [
    { label: "Role", value: role },
    { label: "Result", value: outcome },
  ].filter((fact) => fact.value);

  return (
    <article className="grid items-center gap-8 md:grid-cols-12 md:gap-14">
      <div className={cn("md:col-span-7", flip && "md:order-2")}>
        <InViewClip video={video} poster={poster} title={title} />
      </div>
      <div className="md:col-span-5">
        <ProjectAward award={award} className="mb-4" />
        {headline ? (
          <>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="mt-2 text-3xl leading-[1.05] font-medium tracking-tighter md:text-4xl">
              {headline}
            </h3>
          </>
        ) : (
          <h3 className="text-3xl leading-[1.05] font-medium tracking-tighter md:text-4xl">
            {title}
          </h3>
        )}
        <p className="mt-4 text-muted-foreground">{description}</p>
        {facts.length > 0 && (
          <dl className="mt-5 space-y-1.5 text-sm">
            {facts.map(({ label, value }) => (
              <div key={label} className="flex gap-3">
                <dt className="w-12 shrink-0 text-muted-foreground">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        )}
        <ProjectTags tags={tags} className="mt-6" />
        <ProjectLinks github={github} live={live} demo={demo} devpost={devpost} note={note} className="mt-6" />
      </div>
    </article>
  );
}
