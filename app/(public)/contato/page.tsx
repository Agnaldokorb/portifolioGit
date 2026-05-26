import { ContactForm } from "@/components/public/contact-form";
import { SectionHeading } from "@/components/public/section-heading";
import { getProfile } from "@/lib/portfolio/data";

export const metadata = {
  title: "Contato",
};

export default async function ContactPage() {
  const profile = await getProfile();

  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <SectionHeading
          eyebrow="Contato"
          title="Vamos conversar"
          description="Use o formulario para enviar uma mensagem. Ela sera salva com seguranca no Supabase."
        />
        <div className="mt-8 rounded-lg border bg-card p-5 text-sm leading-6 text-muted">
          <p>{profile.email}</p>
          <p>{profile.location}</p>
          <a href={profile.githubUrl} className="text-primary">
            {profile.githubUrl}
          </a>
        </div>
      </div>
      <ContactForm />
    </section>
  );
}
