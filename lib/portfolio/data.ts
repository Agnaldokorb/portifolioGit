import "server-only";

import { getDb } from "@/db/client";
import {
  profiles,
  projects as projectsTable,
  technologies as technologiesTable,
} from "@/db/schema";
import { getGithubRepositories, githubRepositorySlug } from "@/lib/github/repos";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type {
  PortfolioProfile,
  PortfolioProject,
  Technology,
} from "@/types/portfolio";

type ProjectRow = {
  id: string;
  github_id: number | null;
  github_name: string | null;
  slug: string;
  title: string;
  description: string;
  language: string | null;
  github_url: string | null;
  deploy_url: string | null;
  stars: number;
  forks: number;
  is_featured: boolean;
  is_hidden: boolean;
  is_manual: boolean;
  updated_at: string | null;
};

const fallbackProfile: PortfolioProfile = {
  name: "Agnaldo Korb",
  headline: "Desenvolvedor Full-Stack",
  bio: "Desenvolvedor focado em criar produtos web modernos, acessiveis e performaticos com React, Next.js, Node.js e bancos relacionais.",
  location: "Brasil",
  email: "contato@agnaldokorb.dev",
  githubUrl: "https://github.com/Agnaldokorb",
  linkedinUrl: null,
};

const fallbackTechnologies: Technology[] = [
  {
    id: "next",
    name: "Next.js",
    category: "Frontend",
    level: "avancado",
    isVisible: true,
  },
  {
    id: "react",
    name: "React",
    category: "Frontend",
    level: "avancado",
    isVisible: true,
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "Linguagem",
    level: "avancado",
    isVisible: true,
  },
  {
    id: "node",
    name: "Node.js",
    category: "Backend",
    level: "avancado",
    isVisible: true,
  },
  {
    id: "supabase",
    name: "Supabase",
    category: "Banco e Auth",
    level: "avancado",
    isVisible: true,
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "Banco de dados",
    level: "avancado",
    isVisible: true,
  },
];

export async function getProfile(): Promise<PortfolioProfile> {
  const db = getDb();

  if (db) {
    try {
      const [profile] = await db.select().from(profiles).limit(1);

      if (profile) {
        return {
          name: profile.name,
          headline: profile.headline,
          bio: profile.bio,
          location: profile.location,
          email: profile.email,
          githubUrl: profile.githubUrl,
          linkedinUrl: profile.linkedinUrl,
        };
      }
    } catch (error) {
      console.error("Failed to load profile from DATABASE_URL", error);
    }
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return fallbackProfile;
  }

  const { data } = await supabase
    .from("profiles")
    .select("name, headline, bio, location, email, github_url, linkedin_url")
    .limit(1)
    .maybeSingle();

  if (!data) {
    return fallbackProfile;
  }

  return {
    name: data.name,
    headline: data.headline,
    bio: data.bio,
    location: data.location,
    email: data.email,
    githubUrl: data.github_url,
    linkedinUrl: data.linkedin_url,
  };
}

export async function getTechnologies(): Promise<Technology[]> {
  const db = getDb();

  if (db) {
    try {
      const rows = await db.select().from(technologiesTable);
      const visibleTechnologies = rows
        .filter((technology) => technology.isVisible)
        .sort((a, b) =>
          `${a.category}-${a.name}`.localeCompare(`${b.category}-${b.name}`),
        );

      if (visibleTechnologies.length) {
        return visibleTechnologies.map((technology) => ({
          id: technology.id,
          name: technology.name,
          category: technology.category,
          level: technology.level,
          icon: technology.icon,
          isVisible: technology.isVisible,
        }));
      }
    } catch (error) {
      console.error("Failed to load technologies from DATABASE_URL", error);
    }
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return fallbackTechnologies;
  }

  const { data, error } = await supabase
    .from("technologies")
    .select("id, name, category, level, icon, is_visible")
    .eq("is_visible", true)
    .order("category")
    .order("name");

  if (error || !data?.length) {
    return fallbackTechnologies;
  }

  return data.map((technology) => ({
    id: technology.id,
    name: technology.name,
    category: technology.category,
    level: technology.level,
    icon: technology.icon,
    isVisible: technology.is_visible,
  }));
}

async function getProjectRows(includeHidden = false): Promise<ProjectRow[]> {
  const db = getDb();

  if (db) {
    try {
      const rows = await db.select().from(projectsTable);

      return rows
        .filter((project) => includeHidden || !project.isHidden)
        .sort((a, b) => {
          if (a.isFeatured !== b.isFeatured) {
            return a.isFeatured ? -1 : 1;
          }

          return b.updatedAt.getTime() - a.updatedAt.getTime();
        })
        .map((project) => ({
          id: project.id,
          github_id: project.githubId,
          github_name: project.githubName,
          slug: project.slug,
          title: project.title,
          description: project.description,
          language: project.language,
          github_url: project.githubUrl,
          deploy_url: project.deployUrl,
          stars: project.stars,
          forks: project.forks,
          is_featured: project.isFeatured,
          is_hidden: project.isHidden,
          is_manual: project.isManual,
          updated_at: project.updatedAt.toISOString(),
        }));
    } catch (error) {
      console.error("Failed to load projects from DATABASE_URL", error);
    }
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  let query = supabase
    .from("projects")
    .select(
      "id, github_id, github_name, slug, title, description, language, github_url, deploy_url, stars, forks, is_featured, is_hidden, is_manual, updated_at",
    )
    .order("is_featured", { ascending: false })
    .order("updated_at", { ascending: false });

  if (!includeHidden) {
    query = query.eq("is_hidden", false);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return data;
}

export async function getPortfolioProjects(
  options: { includeHidden?: boolean } = {},
): Promise<PortfolioProject[]> {
  const [githubRepositories, projectRows] = await Promise.all([
    getGithubRepositories(),
    getProjectRows(options.includeHidden),
  ]);

  const rowsByGithubId = new Map(
    projectRows
      .filter((project) => project.github_id)
      .map((project) => [project.github_id, project]),
  );

  const githubProjects = githubRepositories.map((repository) => {
    const override = rowsByGithubId.get(repository.id);

    return {
      id: override?.id ?? `github-${repository.id}`,
      slug: override?.slug ?? githubRepositorySlug(repository),
      title: override?.title ?? repository.name,
      description:
        override?.description ??
        repository.description ??
        "Repositorio publico no GitHub de Agnaldo Korb.",
      language: override?.language ?? repository.language,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
      githubUrl: repository.html_url,
      deployUrl: override?.deploy_url ?? repository.homepage,
      updatedAt: repository.updated_at,
      isFeatured: override?.is_featured ?? false,
      isHidden: override?.is_hidden ?? false,
      isManual: false,
      technologies: repository.language ? [repository.language] : [],
    } satisfies PortfolioProject;
  });

  const manualProjects = projectRows
    .filter((project) => project.is_manual)
    .map(
      (project) =>
        ({
          id: project.id,
          slug: project.slug,
          title: project.title,
          description: project.description,
          language: project.language,
          stars: project.stars,
          forks: project.forks,
          githubUrl: project.github_url,
          deployUrl: project.deploy_url,
          updatedAt: project.updated_at,
          isFeatured: project.is_featured,
          isHidden: project.is_hidden,
          isManual: true,
          technologies: project.language ? [project.language] : [],
        }) satisfies PortfolioProject,
    );

  return [...manualProjects, ...githubProjects]
    .filter((project) => options.includeHidden || !project.isHidden)
    .sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) {
        return a.isFeatured ? -1 : 1;
      }

      return (
        new Date(b.updatedAt ?? 0).getTime() -
        new Date(a.updatedAt ?? 0).getTime()
      );
    });
}

export async function getProjectBySlug(slug: string) {
  const projects = await getPortfolioProjects({ includeHidden: false });

  return projects.find((project) => project.slug === slugify(slug)) ?? null;
}
