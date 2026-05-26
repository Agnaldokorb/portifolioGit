import { notFound } from "next/navigation";
import { BlogCommentForm } from "@/components/public/blog-comment-form";
import { SectionHeading } from "@/components/public/section-heading";
import {
  getApprovedComments,
  getBlogPostBySlug,
} from "@/lib/blog/data";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;

function maskEmail(email: string) {
  const [localPart] = email.split("@");

  if (!localPart) {
    return "email@***********";
  }

  return `${localPart}@***********`;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const comments = await getApprovedComments(post.id);

  return (
    <article className="mx-auto max-w-4xl px-4 py-14">
      <SectionHeading
        eyebrow={formatDate(post.publishedAt ?? post.createdAt)}
        title={post.title}
        description={post.excerpt}
      />
      <div className="mt-6 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span key={tag} className="rounded-md border px-2 py-1 text-xs text-primary">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-10 rounded-lg border bg-card p-6">
        <div className="prose prose-slate max-w-none whitespace-pre-line text-foreground prose-p:text-muted">
          {post.content}
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Comentarios</h2>
        <p className="mt-2 text-sm text-muted">
          Para comentar, informe nome de usuario e e-mail valido. Comentarios
          anonimos nao sao aceitos e todos passam por moderacao.
        </p>
        <div className="mt-5 grid gap-4">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-lg border bg-card p-5">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <p className="font-medium">{comment.authorName}</p>
                  <p className="mt-1 text-xs text-muted">
                    {maskEmail(comment.authorEmail)}
                  </p>
                </div>
                <p className="text-xs text-muted">{formatDate(comment.createdAt)}</p>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted">
                {comment.content}
              </p>
            </div>
          ))}
          {!comments.length ? (
            <p className="rounded-lg border bg-card p-5 text-sm text-muted">
              Ainda nao ha comentarios aprovados.
            </p>
          ) : null}
        </div>
        <div className="mt-6">
          <BlogCommentForm postId={post.id} />
        </div>
      </section>
    </article>
  );
}
