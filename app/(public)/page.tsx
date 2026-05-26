import { ArrowRight, Code2, Database, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProjectCard } from "@/components/public/project-card";
import {
  getPortfolioProjects,
  getProfile,
  getTechnologies,
} from "@/lib/portfolio/data";

export const revalidate = 3600;

export default async function HomePage() {
  const [profile, projects, technologies] = await Promise.all([
    getProfile(),
    getPortfolioProjects(),
    getTechnologies(),
  ]);
  const featuredProjects = projects
    .filter((project) => project.isFeatured)
    .slice(0, 3);
  const visibleProjects = featuredProjects.length
    ? featuredProjects
    : projects.slice(0, 3);

  return (
    <>
      <section className="border-b">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-24">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              {profile.headline}
            </p>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
              {profile.name}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              {profile.bio}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/projetos"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
              >
                Ver projetos <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/contato"
                className="inline-flex items-center gap-2 rounded-md border bg-card px-5 py-3 text-sm font-semibold"
              >
                Entrar em contato
              </Link>
            </div>
          </div>
          <div className="grid gap-3 ">
            <div className="overflow-hidden rounded-lg border bg-card">
              <Image
                src="https://github.com/Agnaldokorb.png"
                alt="Avatar publico de Agnaldo Korb no GitHub"
                width={640}
                height={640}
                priority
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
            {[
              {
                icon: Code2,
                title: "Frontend moderno",
                text: "React, Next.js, TypeScript e UI responsiva.",
              },
              {
                icon: Database,
                title: "Backend consistente",
                text: "Node.js, PostgreSQL, Supabase e integracoes.",
              },
              {
                icon: ShieldCheck,
                title: "Produto seguro",
                text: "Validacao, RLS, auth e boas praticas de deploy.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border bg-card p-5">
                <item.icon className="mb-4 size-5 text-primary" />
                <h2 className="font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Projetos
            </p>
            <h2 className="mt-2 text-3xl font-semibold">
              Trabalhos em destaque
            </h2>
          </div>
          <Link href="/projetos" className="text-sm font-medium text-primary">
            Todos os projetos
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {visibleProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
      <section className="border-t bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {technologies.slice(0, 8).map((technology) => (
              <div
                key={technology.id}
                className="rounded-lg border bg-background p-4"
              >
                <p className="font-medium">{technology.name}</p>
                <p className="mt-1 text-sm text-muted">
                  {technology.category}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
