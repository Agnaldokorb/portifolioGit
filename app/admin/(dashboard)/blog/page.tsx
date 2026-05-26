import {
  createBlogPost,
  deleteBlogComment,
  deleteBlogPost,
  updateBlogCommentStatus,
  updateBlogPost,
} from "@/actions/admin";
import {
  getAdminBlogComments,
  getAdminBlogPosts,
} from "@/lib/admin/data";
import { formatDate } from "@/lib/utils";

const commentStatuses = ["pendente", "aprovado", "rejeitado"] as const;

export default async function AdminBlogPage() {
  const [posts, comments] = await Promise.all([
    getAdminBlogPosts(),
    getAdminBlogComments(),
  ]);

  const postTitle = (comment: (typeof comments)[number]) => {
    const post = Array.isArray(comment.blog_posts)
      ? comment.blog_posts[0]
      : comment.blog_posts;

    return post?.title ?? "Post removido";
  };

  return (
    <div>
      <div>
        <p className="text-sm font-medium text-muted">CRUD do banco</p>
        <h1 className="text-3xl font-semibold">Blog</h1>
      </div>

      <section className="mt-8 rounded-lg border bg-card p-5">
        <h2 className="text-xl font-semibold">Criar artigo</h2>
        <form action={createBlogPost} className="mt-4 grid gap-4">
          <input
            name="title"
            placeholder="Titulo"
            required
            className="rounded-md border bg-background px-3 py-2"
          />
          <input
            name="excerpt"
            placeholder="Resumo"
            required
            className="rounded-md border bg-background px-3 py-2"
          />
          <input
            name="coverImage"
            placeholder="URL da capa opcional"
            className="rounded-md border bg-background px-3 py-2"
          />
          <input
            name="tags"
            placeholder="Tags separadas por virgula"
            className="rounded-md border bg-background px-3 py-2"
          />
          <textarea
            name="content"
            placeholder="Conteudo"
            required
            rows={8}
            className="rounded-md border bg-background px-3 py-2"
          />
          <label className="flex items-center gap-2 text-sm">
            <input name="isPublished" type="checkbox" /> Publicar
          </label>
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground md:w-fit">
            Criar artigo
          </button>
        </form>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Artigos salvos</h2>
        <div className="mt-4 grid gap-4">
          {posts.map((post) => (
            <article key={post.id} className="rounded-lg border bg-card p-5">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="text-sm text-muted">
                    {post.is_published ? "Publicado" : "Rascunho"} ·{" "}
                    {formatDate(post.published_at ?? post.created_at)}
                  </p>
                </div>
                <form action={deleteBlogPost}>
                  <input type="hidden" name="id" value={post.id} />
                  <button className="rounded-md border px-3 py-2 text-sm text-red-500 hover:bg-red-500 hover:text-white">
                    Excluir
                  </button>
                </form>
              </div>
              <form action={updateBlogPost} className="grid gap-3">
                <input type="hidden" name="id" value={post.id} />
                <input
                  name="title"
                  defaultValue={post.title}
                  required
                  className="rounded-md border bg-background px-3 py-2"
                />
                <input
                  name="excerpt"
                  defaultValue={post.excerpt}
                  required
                  className="rounded-md border bg-background px-3 py-2"
                />
                <input
                  name="coverImage"
                  defaultValue={post.cover_image ?? ""}
                  placeholder="URL da capa opcional"
                  className="rounded-md border bg-background px-3 py-2"
                />
                <input
                  name="tags"
                  defaultValue={post.tags.join(", ")}
                  placeholder="Tags separadas por virgula"
                  className="rounded-md border bg-background px-3 py-2"
                />
                <textarea
                  name="content"
                  defaultValue={post.content}
                  required
                  rows={8}
                  className="rounded-md border bg-background px-3 py-2"
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    name="isPublished"
                    type="checkbox"
                    defaultChecked={post.is_published}
                  />{" "}
                  Publicar
                </label>
                <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground md:w-fit">
                  Atualizar artigo
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Comentários do blog</h2>
        <div className="mt-4 grid gap-4">
          {comments.map((comment) => (
            <article key={comment.id} className="rounded-lg border bg-card p-5">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{comment.author_name}</h3>
                  <p className="text-sm text-muted">
                    {comment.author_email} · {postTitle(comment)}
                  </p>
                </div>
                <span className="rounded-md border px-2 py-1 text-xs">
                  {comment.status}
                </span>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-muted">
                {comment.content}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <form action={updateBlogCommentStatus} className="flex gap-2">
                  <input type="hidden" name="id" value={comment.id} />
                  <select
                    name="status"
                    defaultValue={comment.status}
                    className="rounded-md border bg-background px-3 py-2 text-sm"
                  >
                    {commentStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
                    Atualizar
                  </button>
                </form>
                <form action={deleteBlogComment}>
                  <input type="hidden" name="id" value={comment.id} />
                  <button className="rounded-md border px-3 py-2 text-sm text-red-500 hover:bg-red-500 hover:text-white">
                    Excluir
                  </button>
                </form>
              </div>
            </article>
          ))}
          {!comments.length ? (
            <p className="rounded-lg border bg-card p-5 text-sm text-muted">
              Nenhum comentário recebido.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
