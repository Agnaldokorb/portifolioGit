import {
  createManualProject,
  deleteProject,
  saveGithubProjectPreference,
  updateProject,
} from "@/actions/admin";
import { getAdminProjects } from "@/lib/admin/data";
import { getGithubRepositories } from "@/lib/github/repos";
import { formatDate } from "@/lib/utils";

export default async function AdminProjectsPage() {
  const [repositories, savedProjects] = await Promise.all([
    getGithubRepositories(),
    getAdminProjects(),
  ]);
  const savedByGithubId = new Map(
    savedProjects
      .filter((project) => project.github_id)
      .map((project) => [project.github_id, project]),
  );

  return (
    <div>
      <div>
        <p className="text-sm font-medium text-muted">CRUD do banco</p>
        <h1 className="text-3xl font-semibold">Projetos</h1>
      </div>

      <section className="mt-8 rounded-lg border bg-card p-5">
        <h2 className="text-xl font-semibold">Criar projeto manual</h2>
        <form
          action={createManualProject}
          className="mt-4 grid gap-4 md:grid-cols-2"
        >
          <input
            name="title"
            placeholder="Titulo"
            required
            className="rounded-md border bg-background px-3 py-2"
          />
          <input
            name="language"
            placeholder="Tecnologia principal"
            className="rounded-md border bg-background px-3 py-2"
          />
          <input
            name="githubUrl"
            placeholder="URL GitHub"
            className="rounded-md border bg-background px-3 py-2"
          />
          <input
            name="deployUrl"
            placeholder="URL Deploy"
            className="rounded-md border bg-background px-3 py-2"
          />
          <textarea
            name="description"
            placeholder="Descricao"
            required
            minLength={1}
            rows={4}
            className="rounded-md border bg-background px-3 py-2 md:col-span-2"
          />
          <label className="flex items-center gap-2 text-sm">
            <input name="isFeatured" type="checkbox" /> Destacar
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input name="isHidden" type="checkbox" /> Ocultar
          </label>
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground md:w-fit">
            Criar projeto
          </button>
        </form>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Projetos salvos no banco</h2>
        <div className="mt-4 grid gap-4">
          {savedProjects.map((project) => (
            <article key={project.id} className="rounded-lg border bg-card p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="text-sm text-muted">
                    {project.is_manual ? "Manual" : "GitHub"} · Atualizado em{" "}
                    {formatDate(project.updated_at)}
                  </p>
                </div>
                <form action={deleteProject}>
                  <input type="hidden" name="id" value={project.id} />
                  <button className="rounded-md border px-3 py-2 text-sm text-red-500 hover:bg-red-500 hover:text-white">
                    Excluir
                  </button>
                </form>
              </div>
              <form action={updateProject} className="grid gap-3 md:grid-cols-2">
                <input type="hidden" name="id" value={project.id} />
                <input
                  name="title"
                  defaultValue={project.title}
                  required
                  className="rounded-md border bg-background px-3 py-2"
                />
                <input
                  name="language"
                  defaultValue={project.language ?? ""}
                  placeholder="Linguagem"
                  className="rounded-md border bg-background px-3 py-2"
                />
                <input
                  name="githubUrl"
                  defaultValue={project.github_url ?? ""}
                  placeholder="URL GitHub"
                  className="rounded-md border bg-background px-3 py-2"
                />
                <input
                  name="deployUrl"
                  defaultValue={project.deploy_url ?? ""}
                  placeholder="URL Deploy"
                  className="rounded-md border bg-background px-3 py-2"
                />
                <textarea
                  name="description"
                  defaultValue={project.description}
                  required
                  minLength={1}
                  rows={4}
                  className="rounded-md border bg-background px-3 py-2 md:col-span-2"
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    name="isFeatured"
                    type="checkbox"
                    defaultChecked={project.is_featured}
                  />{" "}
                  Destacar
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    name="isHidden"
                    type="checkbox"
                    defaultChecked={project.is_hidden}
                  />{" "}
                  Ocultar
                </label>
                <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground md:w-fit">
                  Atualizar projeto
                </button>
              </form>
            </article>
          ))}
          {!savedProjects.length ? (
            <p className="rounded-lg border bg-card p-5 text-sm text-muted">
              Nenhum projeto salvo no banco ainda.
            </p>
          ) : null}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Curadoria dos repositórios GitHub</h2>
        <p className="mt-2 text-sm text-muted">
          Salve um repositório para destacar, ocultar ou sobrescrever título,
          descrição e deploy no banco.
        </p>
        <div className="mt-4 grid gap-4">
          {repositories.map((repository) => {
            const saved = savedByGithubId.get(repository.id);

            return (
              <form
                key={repository.id}
                action={saveGithubProjectPreference}
                className="rounded-lg border bg-card p-5"
              >
                <input type="hidden" name="githubId" value={repository.id} />
                <input type="hidden" name="githubName" value={repository.name} />
                <input
                  type="hidden"
                  name="githubUrl"
                  value={repository.html_url}
                />
                <input
                  type="hidden"
                  name="language"
                  value={saved?.language ?? repository.language ?? ""}
                />
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    name="title"
                    defaultValue={saved?.title ?? repository.name}
                    className="rounded-md border bg-background px-3 py-2"
                  />
                  <input
                    name="deployUrl"
                    defaultValue={saved?.deploy_url ?? repository.homepage ?? ""}
                    placeholder="Deploy"
                    className="rounded-md border bg-background px-3 py-2"
                  />
                </div>
                <textarea
                  name="description"
                  defaultValue={
                    saved?.description ?? repository.description ?? ""
                  }
                  placeholder="Descricao"
                  rows={3}
                  className="mt-3 w-full rounded-md border bg-background px-3 py-2"
                />
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      name="isFeatured"
                      type="checkbox"
                      defaultChecked={saved?.is_featured ?? false}
                    />{" "}
                    Destacar
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      name="isHidden"
                      type="checkbox"
                      defaultChecked={saved?.is_hidden ?? false}
                    />{" "}
                    Ocultar
                  </label>
                  <button className="rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground">
                    Salvar curadoria
                  </button>
                </div>
              </form>
            );
          })}
        </div>
      </section>
    </div>
  );
}
