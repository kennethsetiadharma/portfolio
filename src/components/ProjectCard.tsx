import { ProjectDialog } from "@/components/ProjectDialog";
import { ProjectLinks, ProjectTags } from "@/components/ProjectMeta";
import type { Project } from "@/content/projects";

// All data comes from a Project in src/content/projects.ts.
export function ProjectCard({ project }: { project: Project }) {
  const { title, description, tags, github, live, demo, note } = project;

  return (
    <article className="flex h-full flex-col">
      <ProjectDialog project={project} />
      <h3 className="mt-5 text-xl font-medium tracking-tight">{title}</h3>
      <p className="mt-1.5 text-muted-foreground">{description}</p>
      <ProjectTags tags={tags} className="mt-4" />
      <ProjectLinks github={github} live={live} demo={demo} note={note} className="mt-auto pt-6" />
    </article>
  );
}
