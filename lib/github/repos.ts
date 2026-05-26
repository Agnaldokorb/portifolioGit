import "server-only";

import { slugify } from "@/lib/utils";
import type { GitHubRepository } from "@/types/github";

const GITHUB_REPOS_URL = process.env.GITHUB_REPOS_URL;

export async function getGithubRepositories(): Promise<GitHubRepository[]> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const response = await fetch(
      `${GITHUB_REPOS_URL}?sort=updated&per_page=100`,
      {
        headers,
        next: {
          revalidate: 3600,
          tags: ["github-repositories"],
        },
      },
    );

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const repositories = (await response.json()) as GitHubRepository[];

    return repositories
      .filter((repository) => !repository.fork && !repository.archived)
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      );
  } catch (error) {
    console.error("Failed to fetch GitHub repositories", error);
    return [];
  }
}

export function githubRepositorySlug(repository: Pick<GitHubRepository, "name">) {
  return slugify(repository.name);
}
