import "server-only";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminProjectRow = {
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
  created_at: string | null;
};

export type AdminTechnologyRow = {
  id: string;
  name: string;
  category: string;
  level: "iniciante" | "intermediario" | "avancado" | "especialista";
  icon: string | null;
  is_visible: boolean;
  created_at: string | null;
};

export type AdminMessageRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "nao_lida" | "lida" | "arquivada";
  created_at: string | null;
};

export type AdminBlogPostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  tags: string[];
  is_published: boolean;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type AdminBlogCommentRow = {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  status: "pendente" | "aprovado" | "rejeitado";
  created_at: string | null;
  blog_posts:
    | {
    title: string;
    slug: string;
      }
    | {
        title: string;
        slug: string;
      }[]
    | null;
};

async function requireAdminDataClient() {
  const sessionClient = await createSupabaseServerClient();

  if (!sessionClient) {
    throw new Error("Supabase ainda nao foi configurado.");
  }

  const {
    data: { user },
  } = await sessionClient.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return createSupabaseAdminClient() ?? sessionClient;
}

export async function getAdminProjects(): Promise<AdminProjectRow[]> {
  const supabase = await requireAdminDataClient();

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, github_id, github_name, slug, title, description, language, github_url, deploy_url, stars, forks, is_featured, is_hidden, is_manual, updated_at, created_at",
    )
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(`Erro ao carregar projetos: ${error.message}`);
  }

  return data ?? [];
}

export async function getAdminTechnologies(): Promise<AdminTechnologyRow[]> {
  const supabase = await requireAdminDataClient();

  const { data, error } = await supabase
    .from("technologies")
    .select("id, name, category, level, icon, is_visible, created_at")
    .order("category")
    .order("name");

  if (error) {
    throw new Error(`Erro ao carregar tecnologias: ${error.message}`);
  }

  return data ?? [];
}

export async function getAdminMessages(): Promise<AdminMessageRow[]> {
  const supabase = await requireAdminDataClient();

  const { data, error } = await supabase
    .from("messages")
    .select("id, name, email, subject, message, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Erro ao carregar mensagens: ${error.message}`);
  }

  return data ?? [];
}

export async function getAdminBlogPosts(): Promise<AdminBlogPostRow[]> {
  const supabase = await requireAdminDataClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, content, cover_image, tags, is_published, published_at, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Erro ao carregar posts: ${error.message}`);
  }

  return data ?? [];
}

export async function getAdminBlogComments(): Promise<AdminBlogCommentRow[]> {
  const supabase = await requireAdminDataClient();

  const { data, error } = await supabase
    .from("blog_comments")
    .select("id, post_id, author_name, author_email, content, status, created_at, blog_posts(title, slug)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Erro ao carregar comentarios do blog: ${error.message}`);
  }

  return (data ?? []) as unknown as AdminBlogCommentRow[];
}
