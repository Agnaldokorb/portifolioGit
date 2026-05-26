import { Code2, ExternalLink, GitFork, Star } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { PortfolioProject } from "@/types/portfolio";

export function ProjectCard({ project }: { project: PortfolioProject }) {
  return (
    <article className="flex h-full flex-col rounded-lg border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link
            href={`/projetos/${project.slug}`}
            className="text-lg font-semibold hover:text-primary"
          >
            {project.title}
          </Link>
          <p className="mt-1 text-xs text-muted">
            Atualizado em {formatDate(project.updatedAt)}
          </p>
        </div>
        {project.isFeatured ? (
          <span className="rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
            Destaque
          </span>
        ) : null}
      </div>
      <p className="mt-4 flex-1 text-sm leading-6 text-muted">
        {project.description}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-muted">
        {project.language ? (
          <span className="rounded-md border px-2 py-1">{project.language}</span>
        ) : null}
        <span className="inline-flex items-center gap-1">
          <Star className="size-3.5" /> {project.stars}
        </span>
        <span className="inline-flex items-center gap-1">
          <GitFork className="size-3.5" /> {project.forks}
        </span>
      </div>
      <div className="mt-5 flex gap-3">
        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            <Code2 className="size-4" /> GitHub
          </a>
        ) : null}
        {project.deployUrl ? (
          <a
            href={project.deployUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            <ExternalLink className="size-4" /> Deploy
          </a>
        ) : null}
      </div>
    </article>
  );
}
