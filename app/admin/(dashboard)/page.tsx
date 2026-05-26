import {
  getAdminMessages,
  getAdminProjects,
  getAdminTechnologies,
} from "@/lib/admin/data";

export default async function AdminPage() {
  const [projects, technologies, messages] = await Promise.all([
    getAdminProjects(),
    getAdminTechnologies(),
    getAdminMessages(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-semibold">Resumo</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { label: "Projetos", value: projects.length },
          { label: "Tecnologias", value: technologies.length },
          { label: "Mensagens", value: messages.length },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border bg-card p-5">
            <p className="text-sm text-muted">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
