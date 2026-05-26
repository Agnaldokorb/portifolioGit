import {
  createTechnology,
  deleteTechnology,
  updateTechnology,
} from "@/actions/admin";
import { getAdminTechnologies } from "@/lib/admin/data";

const levels = ["iniciante", "intermediario", "avancado", "especialista"] as const;

export default async function AdminTechnologiesPage() {
  const technologies = await getAdminTechnologies();

  return (
    <div>
      <div>
        <p className="text-sm font-medium text-muted">CRUD do banco</p>
        <h1 className="text-3xl font-semibold">Tecnologias</h1>
      </div>

      <section className="mt-8 rounded-lg border bg-card p-5">
        <h2 className="text-xl font-semibold">Criar tecnologia</h2>
        <form
          action={createTechnology}
          className="mt-4 grid gap-4 md:grid-cols-5"
        >
          <input
            name="name"
            placeholder="Nome"
            required
            className="rounded-md border bg-background px-3 py-2"
          />
          <input
            name="category"
            placeholder="Categoria"
            required
            className="rounded-md border bg-background px-3 py-2"
          />
          <input
            name="icon"
            placeholder="URL direta da imagem (.png, .jpg, .webp)"
            className="rounded-md border bg-background px-3 py-2"
          />
          <select
            name="level"
            defaultValue="avancado"
            className="rounded-md border bg-background px-3 py-2"
          >
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input name="isVisible" type="checkbox" defaultChecked /> Visivel
          </label>
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground md:w-fit">
            Criar tecnologia
          </button>
        </form>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Tecnologias salvas</h2>
        <div className="mt-4 grid gap-4">
          {technologies.map((technology) => (
            <article key={technology.id} className="rounded-lg border bg-card p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{technology.name}</h3>
                  <p className="text-sm text-muted">
                    {technology.category} ·{" "}
                    {technology.is_visible ? "visivel" : "oculta"}
                  </p>
                </div>
                <form action={deleteTechnology}>
                  <input type="hidden" name="id" value={technology.id} />
                  <button className="rounded-md border px-3 py-2 text-sm text-red-500 hover:bg-red-500 hover:text-white">
                    Excluir
                  </button>
                </form>
              </div>
              <form
                action={updateTechnology}
                className="grid gap-3 md:grid-cols-5"
              >
                <input type="hidden" name="id" value={technology.id} />
                <input
                  name="name"
                  defaultValue={technology.name}
                  required
                  className="rounded-md border bg-background px-3 py-2"
                />
                <input
                  name="category"
                  defaultValue={technology.category}
                  required
                  className="rounded-md border bg-background px-3 py-2"
                />
                <input
                  name="icon"
                  defaultValue={technology.icon ?? ""}
                  placeholder="URL direta da imagem (.png, .jpg, .webp)"
                  className="rounded-md border bg-background px-3 py-2"
                />
                <select
                  name="level"
                  defaultValue={technology.level}
                  className="rounded-md border bg-background px-3 py-2"
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    name="isVisible"
                    type="checkbox"
                    defaultChecked={technology.is_visible}
                  />{" "}
                  Visivel
                </label>
                <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground md:w-fit">
                  Atualizar
                </button>
              </form>
            </article>
          ))}
          {!technologies.length ? (
            <p className="rounded-lg border bg-card p-5 text-sm text-muted">
              Nenhuma tecnologia cadastrada.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
