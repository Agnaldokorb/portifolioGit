import type { Technology } from "@/types/portfolio";

function isImageUrl(value?: string | null) {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function TechnologyCard({ technology }: { technology: Technology }) {
  const imageUrl = isImageUrl(technology.icon) ? technology.icon : null;
  const initials = technology.name.slice(0, 2).toUpperCase();

  return (
    <article className="overflow-hidden rounded-lg border bg-card">
      {imageUrl ? (
        <div className="aspect-[16/9] bg-background">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={`Imagem da tecnologia ${technology.name}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/9] items-center justify-center bg-background">
          <span className="rounded-md border px-4 py-3 text-2xl font-semibold text-primary">
            {initials}
          </span>
        </div>
      )}
      <div className="p-5">
        <h2 className="font-semibold">{technology.name}</h2>
        <p className="mt-2 text-sm text-muted">{technology.category}</p>
        <p className="mt-4 text-xs uppercase tracking-[0.16em] text-primary">
          {technology.level}
        </p>
      </div>
    </article>
  );
}
