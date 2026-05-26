import "server-only";

import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { blogComments, blogPosts } from "@/db/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  tags: string[];
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string | null;
};

export type BlogComment = {
  id: string;
  postId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  status: "pendente" | "aprovado" | "rejeitado";
  createdAt: string | null;
};

const fallbackPost: BlogPost = {
  id: "fallback-post",
  slug: "arquitetura-nextjs-supabase",
  title: "Como estruturar um portfolio full-stack moderno",
  excerpt:
    "Uma visao pratica sobre Next.js, Supabase, validacao e organizacao de camadas.",
  content:
    "Um blog tecnico precisa ser simples de ler, responsivo e conectado ao produto. Use posts objetivos, comentarios moderados e uma area administrativa clara para acompanhar interacoes.",
  coverImage: null,
  tags: ["Next.js", "Supabase", "Arquitetura"],
  isPublished: true,
  publishedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};

function mapPost(row: {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  cover_image?: string | null;
  tags: string[] | null;
  isPublished?: boolean;
  is_published?: boolean;
  publishedAt?: Date | string | null;
  published_at?: string | null;
  createdAt?: Date | string | null;
  created_at?: string | null;
}): BlogPost {
  const publishedAt = row.publishedAt ?? row.published_at ?? null;
  const createdAt = row.createdAt ?? row.created_at ?? null;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.coverImage ?? row.cover_image ?? null,
    tags: row.tags ?? [],
    isPublished: row.isPublished ?? row.is_published ?? false,
    publishedAt:
      publishedAt instanceof Date ? publishedAt.toISOString() : publishedAt,
    createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt,
  };
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const db = getDb();

  if (db) {
    try {
      const rows = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.isPublished, true))
        .orderBy(desc(blogPosts.publishedAt));

      if (rows.length) {
        return rows.map(mapPost);
      }
    } catch (error) {
      console.error("Failed to load blog posts from DATABASE_URL", error);
    }
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [fallbackPost];
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, content, cover_image, tags, is_published, published_at, created_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error || !data?.length) {
    return [fallbackPost];
  }

  return data.map(mapPost);
}

export async function getBlogPostBySlug(slug: string) {
  const posts = await getPublishedBlogPosts();

  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getApprovedComments(postId: string): Promise<BlogComment[]> {
  if (postId === fallbackPost.id) {
    return [];
  }

  const db = getDb();

  if (db) {
    try {
      const rows = await db
        .select()
        .from(blogComments)
        .where(eq(blogComments.postId, postId))
        .orderBy(desc(blogComments.createdAt));

      return rows
        .filter((comment) => comment.status === "aprovado")
        .map((comment) => ({
          id: comment.id,
          postId: comment.postId,
          authorName: comment.authorName,
          authorEmail: comment.authorEmail,
          content: comment.content,
          status: comment.status,
          createdAt: comment.createdAt.toISOString(),
        }));
    } catch (error) {
      console.error("Failed to load blog comments from DATABASE_URL", error);
    }
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("blog_comments")
    .select("id, post_id, author_name, author_email, content, status, created_at")
    .eq("post_id", postId)
    .eq("status", "aprovado")
    .order("created_at", { ascending: false });

  return (
    data?.map((comment) => ({
      id: comment.id,
      postId: comment.post_id,
      authorName: comment.author_name,
      authorEmail: comment.author_email,
      content: comment.content,
      status: comment.status,
      createdAt: comment.created_at,
    })) ?? []
  );
}
