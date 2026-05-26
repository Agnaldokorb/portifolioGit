import Link from "next/link";
import { CalendarDays, MessageSquareText } from "lucide-react";
import { SectionHeading } from "@/components/public/section-heading";
import { getPublishedBlogPosts } from "@/lib/blog/data";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Blog",
};

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <SectionHeading
        eyebrow="Artigos"
        title="Blog"
        description="Notas tecnicas, arquitetura, frontend, backend e decisoes praticas de engenharia."
      />

      {featured ? (
        <Link
          href={`/blog/${featured.slug}`}
          className="mt-10 grid overflow-hidden rounded-lg border bg-card transition hover:border-primary lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="flex min-h-72 items-end bg-background p-6">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                {featured.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border px-2 py-1 text-xs text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="max-w-2xl text-3xl font-semibold tracking-tight">
                {featured.title}
              </h2>
            </div>
          </div>
          <div className="p-6">
            <p className="text-sm leading-6 text-muted">{featured.excerpt}</p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="size-4" />
                {formatDate(featured.publishedAt ?? featured.createdAt)}
              </span>
              <span className="inline-flex items-center gap-2">
                <MessageSquareText className="size-4" />
                Comentarios moderados
              </span>
            </div>
          </div>
        </Link>
      ) : null}

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="rounded-lg border bg-card p-5 transition hover:-translate-y-1 hover:border-primary"
          >
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs text-primary">
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="mt-4 text-xl font-semibold">{post.title}</h2>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">
              {post.excerpt}
            </p>
            <p className="mt-5 text-xs text-muted">
              {formatDate(post.publishedAt ?? post.createdAt)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
