import { ProjectCard } from "@/components/public/project-card";
import { SectionHeading } from "@/components/public/section-heading";
import { getPortfolioProjects } from "@/lib/portfolio/data";

export const metadata = {
  title: "Projetos",
};

export const revalidate = 3600;

export default async function ProjectsPage() {
  const projects = await getPortfolioProjects();

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <SectionHeading
        eyebrow="GitHub + curadoria"
        title="Projetos"
        description="Repositorios publicos importados automaticamente do GitHub, com curadoria manual feita pela area admin."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      {!projects.length ? (
        <p className="mt-10 rounded-lg border bg-card p-5 text-muted">
          Nao foi possivel carregar os repositorios do GitHub agora.
        </p>
      ) : null}
    </section>
  );
}
