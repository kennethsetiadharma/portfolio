import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { ProjectCard } from "@/components/ProjectCard";
import { Section } from "@/components/Section";
import { projects } from "@/content/projects";

export function Projects() {
  return (
    <Section id="work" title="Work">
      <Stagger className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <StaggerItem key={project.title}>
            <ProjectCard project={project} />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
