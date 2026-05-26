import { deleteProfile, updateProfile } from "@/actions/admin";
import { getProfile } from "@/lib/portfolio/data";

export default async function AdminProfilePage() {
  const profile = await getProfile();

  return (
    <div>
      <div>
        <p className="text-sm font-medium text-muted">CRUD do banco</p>
        <h1 className="text-3xl font-semibold">Perfil</h1>
      </div>

      <form
        action={updateProfile}
        className="mt-8 grid max-w-3xl gap-4 rounded-lg border bg-card p-5"
      >
        <label className="grid gap-2 text-sm font-medium">
          Nome
          <input
            name="name"
            defaultValue={profile.name}
            required
            className="rounded-md border bg-background px-3 py-2"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Titulo profissional
          <input
            name="headline"
            defaultValue={profile.headline}
            required
            className="rounded-md border bg-background px-3 py-2"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Bio
          <textarea
            name="bio"
            defaultValue={profile.bio}
            required
            rows={5}
            className="rounded-md border bg-background px-3 py-2"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Localizacao
          <input
            name="location"
            defaultValue={profile.location}
            required
            className="rounded-md border bg-background px-3 py-2"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          E-mail
          <input
            name="email"
            type="email"
            defaultValue={profile.email}
            required
            className="rounded-md border bg-background px-3 py-2"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          GitHub
          <input
            name="githubUrl"
            type="url"
            defaultValue={profile.githubUrl}
            required
            className="rounded-md border bg-background px-3 py-2"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          LinkedIn
          <input
            name="linkedinUrl"
            type="url"
            defaultValue={profile.linkedinUrl ?? ""}
            className="rounded-md border bg-background px-3 py-2"
          />
        </label>
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground md:w-fit">
          Salvar perfil
        </button>
      </form>

      <form action={deleteProfile} className="mt-6 max-w-3xl rounded-lg border bg-card p-5">
        <h2 className="font-semibold">Excluir perfil salvo</h2>
        <p className="mt-2 text-sm text-muted">
          Remove apenas a linha da tabela `profiles`. O usuario de autenticacao
          permanece ativo e a area publica volta a usar os dados padrao.
        </p>
        <button className="mt-4 rounded-md border px-3 py-2 text-sm text-red-500 hover:bg-red-500 hover:text-white">
          Excluir perfil do banco
        </button>
      </form>
    </div>
  );
}
