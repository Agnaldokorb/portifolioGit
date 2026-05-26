export type PortfolioProfile = {
  name: string;
  headline: string;
  bio: string;
  location: string;
  email: string;
  githubUrl: string;
  linkedinUrl?: string | null;
};

export type PortfolioProject = {
  id: string;
  slug: string;
  title: string;
  description: string;
  language: string | null;
  stars: number;
  forks: number;
  githubUrl?: string | null;
  deployUrl?: string | null;
  updatedAt?: string | null;
  isFeatured: boolean;
  isHidden: boolean;
  isManual: boolean;
  technologies: string[];
};

export type Technology = {
  id: string;
  name: string;
  category: string;
  level: "iniciante" | "intermediario" | "avancado" | "especialista";
  icon?: string | null;
  isVisible: boolean;
};
