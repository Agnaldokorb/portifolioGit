import { deleteMessage, updateMessageStatus } from "@/actions/admin";
import { getAdminMessages } from "@/lib/admin/data";
import { formatDate } from "@/lib/utils";

const statuses = ["nao_lida", "lida", "arquivada"] as const;

export default async function AdminMessagesPage() {
  const messages = await getAdminMessages();

  return (
    <div>
      <div>
        <p className="text-sm font-medium text-muted">CRUD do banco</p>
        <h1 className="text-3xl font-semibold">Mensagens</h1>
      </div>

      <div className="mt-8 grid gap-4">
        {messages.map((message) => (
          <article key={message.id} className="rounded-lg border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{message.subject}</h2>
                <p className="mt-1 text-sm text-muted">
                  {message.name} · {message.email} ·{" "}
                  {formatDate(message.created_at)}
                </p>
              </div>
              <span className="rounded-md border px-2 py-1 text-xs">
                {message.status}
              </span>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-muted">
              {message.message}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <form action={updateMessageStatus} className="flex gap-2">
                <input type="hidden" name="id" value={message.id} />
                <select
                  name="status"
                  defaultValue={message.status}
                  className="rounded-md border bg-background px-3 py-2 text-sm"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <button className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
                  Atualizar
                </button>
              </form>
              <form action={deleteMessage}>
                <input type="hidden" name="id" value={message.id} />
                <button className="rounded-md border px-3 py-2 text-sm text-red-500 hover:bg-red-500 hover:text-white">
                  Excluir
                </button>
              </form>
            </div>
          </article>
        ))}
        {!messages.length ? (
          <p className="rounded-lg border bg-card p-5 text-sm text-muted">
            Nenhuma mensagem recebida.
          </p>
        ) : null}
      </div>
    </div>
  );
}
