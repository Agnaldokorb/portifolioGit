import { SectionHeading } from "@/components/public/section-heading";
import { getProfile } from "@/lib/portfolio/data";

export const metadata = {
  title: "Sobre",
};

export default async function AboutPage() {
  const profile = await getProfile();

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <SectionHeading
        eyebrow="Sobre mim"
        title="Engenharia de software com foco em produto"
        description={profile.bio}
      />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          "Arquitetura full-stack com separacao clara entre UI, dominio e infraestrutura.",
          "Interfaces responsivas, acessiveis e orientadas a fluxos reais de usuario.",
          "Integracoes com APIs externas, autenticacao, banco relacional e deploy em nuvem.",
        ].map((item) => (
          <div
            key={item}
            className="rounded-lg border bg-card p-5 text-sm leading-6 text-muted"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
