import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const technologyLevel = pgEnum("technology_level", [
  "iniciante",
  "intermediario",
  "avancado",
  "especialista",
]);

export const messageStatus = pgEnum("message_status", [
  "nao_lida",
  "lida",
  "arquivada",
]);

export const blogCommentStatus = pgEnum("blog_comment_status", [
  "pendente",
  "aprovado",
  "rejeitado",
]);

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  headline: text("headline").notNull(),
  bio: text("bio").notNull(),
  location: text("location").notNull().default("Brasil"),
  email: text("email").notNull(),
  githubUrl: text("github_url").notNull(),
  linkedinUrl: text("linkedin_url"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    githubId: integer("github_id"),
    githubName: text("github_name"),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    language: text("language"),
    githubUrl: text("github_url"),
    deployUrl: text("deploy_url"),
    stars: integer("stars").default(0).notNull(),
    forks: integer("forks").default(0).notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    isHidden: boolean("is_hidden").default(false).notNull(),
    isManual: boolean("is_manual").default(false).notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("projects_slug_idx").on(table.slug),
    uniqueIndex("projects_github_id_idx")
      .on(table.githubId)
      .where(sql`${table.githubId} is not null`),
    index("projects_featured_idx").on(table.isFeatured),
  ],
);

export const technologies = pgTable(
  "technologies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    level: technologyLevel("level").default("avancado").notNull(),
    icon: text("icon"),
    isVisible: boolean("is_visible").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [uniqueIndex("technologies_name_idx").on(table.name)],
);

export const projectTechnologies = pgTable(
  "project_technologies",
  {
    projectId: uuid("project_id")
      .references(() => projects.id, { onDelete: "cascade" })
      .notNull(),
    technologyId: uuid("technology_id")
      .references(() => technologies.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.projectId, table.technologyId] })],
);

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: messageStatus("status").default("nao_lida").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const settings = pgTable(
  "settings",
  {
    key: text("key").primaryKey(),
    value: jsonb("value").$type<Record<string, unknown>>().notNull(),
    isPublic: boolean("is_public").default(false).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("settings_public_idx").on(table.isPublic)],
);

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    content: text("content").notNull(),
    coverImage: text("cover_image"),
    tags: text("tags").array().default([]).notNull(),
    isPublished: boolean("is_published").default(false).notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("blog_posts_slug_idx").on(table.slug),
    index("blog_posts_published_idx").on(table.isPublished),
  ],
);

export const blogComments = pgTable(
  "blog_comments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    postId: uuid("post_id")
      .references(() => blogPosts.id, { onDelete: "cascade" })
      .notNull(),
    authorName: text("author_name").notNull(),
    authorEmail: text("author_email").notNull(),
    content: text("content").notNull(),
    status: blogCommentStatus("status").default("pendente").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("blog_comments_post_idx").on(table.postId),
    index("blog_comments_status_idx").on(table.status),
  ],
);

export const projectsRelations = relations(projects, ({ many }) => ({
  projectTechnologies: many(projectTechnologies),
}));

export const technologiesRelations = relations(technologies, ({ many }) => ({
  projectTechnologies: many(projectTechnologies),
}));

export const projectTechnologiesRelations = relations(
  projectTechnologies,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectTechnologies.projectId],
      references: [projects.id],
    }),
    technology: one(technologies, {
      fields: [projectTechnologies.technologyId],
      references: [technologies.id],
    }),
  }),
);
