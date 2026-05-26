import { Code2, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/public/section-heading";
import { getGithubRepositories, githubRepositorySlug } from "@/lib/github/repos";
import { getProjectBySlug } from "@/lib/portfolio/data";
import { formatDate } from "@/lib/utils";

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await getGithubRepositories();

  return projects.map((project) => ({ slug: githubRepositorySlug(project) }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-14">
      <SectionHeading
        eyebrow={project.language ?? "Projeto"}
        title={project.title}
        description={project.description}
      />
      <dl className="mt-10 grid gap-4 rounded-lg border bg-card p-5 sm:grid-cols-3">
        <div>
          <dt className="text-sm text-muted">Stars</dt>
          <dd className="mt-1 text-2xl font-semibold">{project.stars}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Forks</dt>
          <dd className="mt-1 text-2xl font-semibold">{project.forks}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Atualizado</dt>
          <dd className="mt-1 text-lg font-semibold">
            {formatDate(project.updatedAt)}
          </dd>
        </div>
      </dl>
      <div className="mt-8 flex flex-wrap gap-3">
        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Code2 className="size-4" /> Ver no GitHub
          </a>
        ) : null}
        {project.deployUrl ? (
          <a
            href={project.deployUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border bg-card px-4 py-2 text-sm font-semibold"
          >
            <ExternalLink className="size-4" /> Abrir deploy
          </a>
        ) : null}
      </div>
    </section>
  );
}
