import { SectionHeading } from "@/components/public/section-heading";
import { TechnologyCard } from "@/components/public/technology-card";
import { getTechnologies } from "@/lib/portfolio/data";

export const metadata = {
  title: "Tecnologias",
};

export default async function TechnologiesPage() {
  const technologies = await getTechnologies();

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <SectionHeading
        eyebrow="Stack"
        title="Tecnologias"
        description="Ferramentas usadas para construir aplicacoes web modernas, seguras e escalaveis."
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {technologies.map((technology) => (
          <TechnologyCard key={technology.id} technology={technology} />
        ))}
      </div>
    </section>
  );
}
