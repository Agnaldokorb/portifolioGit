import { SectionHeading } from "@/components/public/section-heading";

export const metadata = {
  title: "Experiencia",
};

const items = [
  {
    title: "Desenvolvimento full-stack",
    text: "Construcao de interfaces, APIs, autenticacao, persistencia e integracoes com servicos externos.",
  },
  {
    title: "Arquitetura e qualidade",
    text: "Separacao por camadas, validacao com Zod, TypeScript strict, testes e revisao de seguranca.",
  },
  {
    title: "Deploy e operacao",
    text: "Preparacao para Vercel, variaveis de ambiente, observabilidade basica e checklist de producao.",
  },
];

export default function ExperiencePage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <SectionHeading
        eyebrow="Experiencia"
        title="Entrega ponta a ponta"
        description="Da concepcao tecnica ao deploy, com foco em clareza, manutenibilidade e resultado."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {items.map((item) => (
          <article key={item.title} className="rounded-lg border bg-card p-5">
            <h2 className="font-semibold">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
