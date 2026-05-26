import Link from "next/link";
import {
  getAdminBlogComments,
  getAdminBlogPosts,
  getAdminMessages,
  getAdminProjects,
  getAdminTechnologies,
} from "@/lib/admin/data";
import { formatDate } from "@/lib/utils";

export default async function MonitoringPage() {
  const [posts, comments, messages, projects, technologies] = await Promise.all([
    getAdminBlogPosts(),
    getAdminBlogComments(),
    getAdminMessages(),
    getAdminProjects(),
    getAdminTechnologies(),
  ]);
  const pendingComments = comments.filter(
    (comment) => comment.status === "pendente",
  );
  const unreadMessages = messages.filter((message) => message.status === "nao_lida");

  return (
    <div>
      <div>
        <p className="text-sm font-medium text-muted">Operação</p>
        <h1 className="text-3xl font-semibold">Central de monitoramento</h1>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-5">
        {[
          { label: "Posts", value: posts.length },
          { label: "Comentários pendentes", value: pendingComments.length },
          { label: "Mensagens não lidas", value: unreadMessages.length },
          { label: "Projetos", value: projects.length },
          { label: "Tecnologias", value: technologies.length },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border bg-card p-5">
            <p className="text-sm text-muted">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold">{item.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Comentários pendentes</h2>
            <Link href="/admin/blog" className="text-sm text-primary">
              Moderar
            </Link>
          </div>
          <div className="mt-4 grid gap-4">
            {pendingComments.slice(0, 5).map((comment) => (
              <div key={comment.id} className="rounded-md border p-4">
                <p className="font-medium">{comment.author_name}</p>
                <p className="mt-1 text-xs text-muted">{comment.author_email}</p>
                <p className="mt-3 line-clamp-3 text-sm text-muted">
                  {comment.content}
                </p>
              </div>
            ))}
            {!pendingComments.length ? (
              <p className="text-sm text-muted">Nenhum comentário pendente.</p>
            ) : null}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Atividade recente</h2>
            <Link href="/admin/mensagens" className="text-sm text-primary">
              Ver mensagens
            </Link>
          </div>
          <div className="mt-4 grid gap-4">
            {messages.slice(0, 5).map((message) => (
              <div key={message.id} className="rounded-md border p-4">
                <p className="font-medium">{message.subject}</p>
                <p className="mt-1 text-xs text-muted">
                  {message.name} · {formatDate(message.created_at)}
                </p>
                <p className="mt-3 line-clamp-2 text-sm text-muted">
                  {message.message}
                </p>
              </div>
            ))}
            {!messages.length ? (
              <p className="text-sm text-muted">Nenhuma mensagem recente.</p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
