import { Reveal } from "@/components/motion/Reveal";
import { ProjectRow } from "@/components/ProjectRow";
import { Section } from "@/components/Section";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export function Projects() {
  return (
    <Section id="work" {...site.sections.work}>
      <div className="space-y-24 md:space-y-36">
        {projects
          .filter((project) => !project.hidden)
          .map((project, i) => (
            <Reveal key={project.title}>
              <ProjectRow project={project} flip={i % 2 === 1} />
            </Reveal>
          ))}
      </div>
    </Section>
  );
}
