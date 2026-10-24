import Image from "next/image";
import Link from "next/link";
import type { ProjectWithImages } from "../../services/types";

const etiquetaFotos = (n: number) => `${n} ${n === 1 ? "foto" : "fotos"}`;

export function ProjectCard({ project }: Readonly<{ project: ProjectWithImages }>) {
  const portada = project.images[0];
  return (
    <article className="group flex flex-col">
      <Link
        href={`/projects/${project.slug}`}
        className="flex flex-1 flex-col gap-4 rounded-tarjeta focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acento-600"
      >
        <div className="relative aspect-[3/2] overflow-hidden rounded-tarjeta bg-marca-50">
          {portada && (
            <Image
              src={portada.imageUrl}
              alt={portada.imageAlt}
              fill
              sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
            />
          )}
          <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-marca-900/85 px-2.5 py-1 text-xs font-semibold text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-3.5">
              <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
              <circle cx="12" cy="13" r="3.5" />
            </svg>
            {etiquetaFotos(project.images.length)}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-marca-900">{project.title}</h2>
          <p className="leading-relaxed text-tinta-suave">{project.summary}</p>
          <span className="mt-1 text-sm font-semibold text-acento-700">Ver proyecto →</span>
        </div>
      </Link>
    </article>
  );
}
