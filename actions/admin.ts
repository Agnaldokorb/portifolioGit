"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { profiles } from "@/db/schema";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { blogCommentStatusSchema, blogPostSchema } from "@/schemas/blog";
import { messageStatusSchema } from "@/schemas/message";
import { profileSchema } from "@/schemas/profile";
import {
  manualProjectSchema,
  projectPreferenceSchema,
  projectUpdateSchema,
} from "@/schemas/project";
import { technologySchema } from "@/schemas/technology";

async function requireSupabaseAdmin() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase ainda nao foi configurado.");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return { supabase: createSupabaseAdminClient() ?? supabase, user };
}

function booleanFromForm(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function requiredId(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    throw new Error("ID obrigatorio.");
  }

  return id;
}

export async function saveGithubProjectPreference(formData: FormData) {
  const parsed = projectPreferenceSchema.safeParse({
    ...Object.fromEntries(formData),
    isFeatured: booleanFromForm(formData, "isFeatured"),
    isHidden: booleanFromForm(formData, "isHidden"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Projeto invalido.");
  }

  const { supabase } = await requireSupabaseAdmin();
  const project = parsed.data;
  const payload = {
    github_id: project.githubId,
    github_name: project.githubName,
    slug: slugify(project.githubName),
    title: project.title,
    description: project.description || "Projeto importado do GitHub.",
    language: project.language || null,
    github_url: project.githubUrl,
    deploy_url: project.deployUrl || null,
    is_featured: project.isFeatured,
    is_hidden: project.isHidden,
    is_manual: false,
    updated_at: new Date().toISOString(),
  };

  const { data: existingProject, error: findError } = await supabase
    .from("projects")
    .select("id")
    .eq("github_id", project.githubId)
    .maybeSingle();

  if (findError) {
    throw new Error(`Erro ao localizar projeto do GitHub: ${findError.message}`);
  }

  const { error } = existingProject
    ? await supabase.from("projects").update(payload).eq("id", existingProject.id)
    : await supabase.from("projects").insert(payload);

  if (error) {
    throw new Error(`Erro ao salvar projeto do GitHub: ${error.message}`);
  }

  revalidateTag("github-repositories", { expire: 0 });
  revalidatePath("/projetos");
  revalidatePath("/admin/projetos");
}

export async function createManualProject(formData: FormData) {
  const parsed = manualProjectSchema.safeParse({
    ...Object.fromEntries(formData),
    isFeatured: booleanFromForm(formData, "isFeatured"),
    isHidden: booleanFromForm(formData, "isHidden"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Projeto invalido.");
  }

  const { supabase } = await requireSupabaseAdmin();
  const project = parsed.data;

  const { error } = await supabase.from("projects").insert({
    slug: slugify(project.title),
    title: project.title,
    description: project.description,
    language: project.language || null,
    github_url: project.githubUrl || null,
    deploy_url: project.deployUrl || null,
    is_featured: project.isFeatured,
    is_hidden: project.isHidden,
    is_manual: true,
  });

  if (error) {
    throw new Error(`Erro ao criar projeto: ${error.message}`);
  }

  revalidatePath("/projetos");
  revalidatePath("/admin/projetos");
}

export async function updateProject(formData: FormData) {
  const parsed = projectUpdateSchema.safeParse({
    ...Object.fromEntries(formData),
    isFeatured: booleanFromForm(formData, "isFeatured"),
    isHidden: booleanFromForm(formData, "isHidden"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Projeto invalido.");
  }

  const { supabase } = await requireSupabaseAdmin();
  const project = parsed.data;

  const { error } = await supabase
    .from("projects")
    .update({
      slug: slugify(project.title),
      title: project.title,
      description: project.description,
      language: project.language || null,
      github_url: project.githubUrl || null,
      deploy_url: project.deployUrl || null,
      is_featured: project.isFeatured,
      is_hidden: project.isHidden,
      updated_at: new Date().toISOString(),
    })
    .eq("id", project.id);

  if (error) {
    throw new Error(`Erro ao atualizar projeto: ${error.message}`);
  }

  revalidateTag("github-repositories", { expire: 0 });
  revalidatePath("/projetos");
  revalidatePath("/admin/projetos");
}

export async function deleteProject(formData: FormData) {
  const id = requiredId(formData);
  const { supabase } = await requireSupabaseAdmin();

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    throw new Error(`Erro ao excluir projeto: ${error.message}`);
  }

  revalidateTag("github-repositories", { expire: 0 });
  revalidatePath("/projetos");
  revalidatePath("/admin/projetos");
}

export async function createTechnology(formData: FormData) {
  const parsed = technologySchema.safeParse({
    ...Object.fromEntries(formData),
    isVisible: booleanFromForm(formData, "isVisible"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Tecnologia invalida.");
  }

  const { supabase } = await requireSupabaseAdmin();
  const technology = parsed.data;

  const { error } = await supabase.from("technologies").upsert(
    {
      name: technology.name,
      category: technology.category,
      level: technology.level,
      icon: technology.icon || null,
      is_visible: technology.isVisible,
    },
    { onConflict: "name" },
  );

  if (error) {
    throw new Error(`Erro ao salvar tecnologia: ${error.message}`);
  }

  revalidatePath("/tecnologias");
  revalidatePath("/admin/tecnologias");
}

export async function updateProfile(formData: FormData) {
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Perfil invalido.");
  }

  const { supabase, user } = await requireSupabaseAdmin();
  const profile = parsed.data;
  const profileValues = {
    id: user.id,
    name: profile.name,
    headline: profile.headline,
    bio: profile.bio,
    location: profile.location,
    email: profile.email,
    githubUrl: profile.githubUrl,
    linkedinUrl: profile.linkedinUrl || null,
    updatedAt: new Date(),
  };

  const db = getDb();

  if (db) {
    await db
      .insert(profiles)
      .values(profileValues)
      .onConflictDoUpdate({
        target: profiles.id,
        set: {
          name: profileValues.name,
          headline: profileValues.headline,
          bio: profileValues.bio,
          location: profileValues.location,
          email: profileValues.email,
          githubUrl: profileValues.githubUrl,
          linkedinUrl: profileValues.linkedinUrl,
          updatedAt: profileValues.updatedAt,
        },
      });

    revalidatePath("/");
    revalidatePath("/admin/perfil");
    return;
  }

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      name: profile.name,
      headline: profile.headline,
      bio: profile.bio,
      location: profile.location,
      email: profile.email,
      github_url: profile.githubUrl,
      linkedin_url: profile.linkedinUrl || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    throw new Error(`Erro ao atualizar perfil: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/admin/perfil");
}

export async function deleteProfile() {
  const { supabase, user } = await requireSupabaseAdmin();
  const db = getDb();

  if (db) {
    await db.delete(profiles).where(eq(profiles.id, user.id));

    revalidatePath("/");
    revalidatePath("/admin/perfil");
    return;
  }

  const { error } = await supabase.from("profiles").delete().eq("id", user.id);

  if (error) {
    throw new Error(`Erro ao excluir perfil: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/admin/perfil");
}

export async function updateTechnology(formData: FormData) {
  const parsed = technologySchema.safeParse({
    ...Object.fromEntries(formData),
    isVisible: booleanFromForm(formData, "isVisible"),
  });

  if (!parsed.success || !parsed.data.id) {
    throw new Error(parsed.error?.issues[0]?.message ?? "Tecnologia invalida.");
  }

  const { supabase } = await requireSupabaseAdmin();
  const technology = parsed.data;

  const { error } = await supabase
    .from("technologies")
    .update({
      name: technology.name,
      category: technology.category,
      level: technology.level,
      icon: technology.icon || null,
      is_visible: technology.isVisible,
    })
    .eq("id", technology.id);

  if (error) {
    throw new Error(`Erro ao atualizar tecnologia: ${error.message}`);
  }

  revalidatePath("/tecnologias");
  revalidatePath("/admin/tecnologias");
}

export async function deleteTechnology(formData: FormData) {
  const id = requiredId(formData);
  const { supabase } = await requireSupabaseAdmin();

  const { error } = await supabase.from("technologies").delete().eq("id", id);

  if (error) {
    throw new Error(`Erro ao excluir tecnologia: ${error.message}`);
  }

  revalidatePath("/tecnologias");
  revalidatePath("/admin/tecnologias");
}

export async function updateMessageStatus(formData: FormData) {
  const id = requiredId(formData);
  const status = messageStatusSchema.parse(
    String(formData.get("status") ?? "lida"),
  );
  const { supabase } = await requireSupabaseAdmin();

  const { error } = await supabase
    .from("messages")
    .update({ status })
    .eq("id", id);

  if (error) {
    throw new Error(`Erro ao atualizar mensagem: ${error.message}`);
  }

  revalidatePath("/admin/mensagens");
}

export async function deleteMessage(formData: FormData) {
  const id = requiredId(formData);
  const { supabase } = await requireSupabaseAdmin();

  const { error } = await supabase.from("messages").delete().eq("id", id);

  if (error) {
    throw new Error(`Erro ao excluir mensagem: ${error.message}`);
  }

  revalidatePath("/admin/mensagens");
}

function tagsFromForm(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export async function createBlogPost(formData: FormData) {
  const parsed = blogPostSchema.safeParse({
    ...Object.fromEntries(formData),
    isPublished: booleanFromForm(formData, "isPublished"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Post invalido.");
  }

  const { supabase } = await requireSupabaseAdmin();
  const post = parsed.data;
  const now = new Date().toISOString();

  const { error } = await supabase.from("blog_posts").insert({
    slug: slugify(post.title),
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    cover_image: post.coverImage || null,
    tags: tagsFromForm(post.tags),
    is_published: post.isPublished,
    published_at: post.isPublished ? now : null,
  });

  if (error) {
    throw new Error(`Erro ao criar post: ${error.message}`);
  }

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  revalidatePath("/admin/monitoramento");
}

export async function updateBlogPost(formData: FormData) {
  const parsed = blogPostSchema.safeParse({
    ...Object.fromEntries(formData),
    isPublished: booleanFromForm(formData, "isPublished"),
  });
  const id = requiredId(formData);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Post invalido.");
  }

  const { supabase } = await requireSupabaseAdmin();
  const post = parsed.data;
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("blog_posts")
    .update({
      slug: slugify(post.title),
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      cover_image: post.coverImage || null,
      tags: tagsFromForm(post.tags),
      is_published: post.isPublished,
      published_at: post.isPublished ? now : null,
      updated_at: now,
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Erro ao atualizar post: ${error.message}`);
  }

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  revalidatePath("/admin/monitoramento");
}

export async function deleteBlogPost(formData: FormData) {
  const id = requiredId(formData);
  const { supabase } = await requireSupabaseAdmin();

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) {
    throw new Error(`Erro ao excluir post: ${error.message}`);
  }

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  revalidatePath("/admin/monitoramento");
}

export async function updateBlogCommentStatus(formData: FormData) {
  const id = requiredId(formData);
  const status = blogCommentStatusSchema.parse(
    String(formData.get("status") ?? "pendente"),
  );
  const { supabase } = await requireSupabaseAdmin();

  const { error } = await supabase
    .from("blog_comments")
    .update({ status })
    .eq("id", id);

  if (error) {
    throw new Error(`Erro ao atualizar comentario: ${error.message}`);
  }

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  revalidatePath("/admin/monitoramento");
}

export async function deleteBlogComment(formData: FormData) {
  const id = requiredId(formData);
  const { supabase } = await requireSupabaseAdmin();

  const { error } = await supabase.from("blog_comments").delete().eq("id", id);

  if (error) {
    throw new Error(`Erro ao excluir comentario: ${error.message}`);
  }

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  revalidatePath("/admin/monitoramento");
}
