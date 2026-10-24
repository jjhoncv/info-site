import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/src/components/Button";
import { EMPRESA } from "@/src/components/empresa";
import { ProjectGallery } from "@/src/module/projects/components/web/ProjectGallery";
import { projectModel } from "@/src/module/projects/core";

// Lee de MySQL en cada visita: lo que se edita en el admin se ve de inmediato.
export const dynamic = "force-dynamic";

type Props = Readonly<{ params: Promise<{ slug: string }> }>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const proyecto = await projectModel.getPublishedProjectBySlug((await params).slug);
  if (!proyecto) return { title: "No encontramos esta página" };
  return {
    title: `${proyecto.metaTitle ?? proyecto.title} · ${EMPRESA.nombre}`,
    description: proyecto.metaDescription ?? proyecto.summary,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const proyecto = await projectModel.getPublishedProjectBySlug((await params).slug);
  if (!proyecto) notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
      <nav aria-label="Ruta" className="text-sm text-tinta-suave">
        <Link href="/projects" className="hover:text-marca-700">
          Proyectos
        </Link>{" "}
        / <span className="text-tinta">{proyecto.title}</span>
      </nav>
      <div className="mt-6 grid items-start gap-10 md:grid-cols-[1.6fr_1fr]">
        <article className="flex min-w-0 flex-col gap-6">
          <h1 className="text-4xl font-bold leading-tight text-marca-900 sm:text-5xl">{proyecto.title}</h1>
          <p className="text-xl leading-relaxed text-tinta-suave">{proyecto.summary}</p>
          <ProjectGallery images={proyecto.images} />
          <p className="max-w-[65ch] text-lg leading-relaxed">{proyecto.description}</p>
        </article>
        <aside className="flex flex-col gap-4 rounded-tarjeta bg-fondo-calido p-7 md:sticky md:top-6">
          <h2 className="text-2xl font-bold text-marca-900">¿Quieres un proyecto así?</h2>
          <p className="leading-relaxed text-tinta-suave">Cuéntanos tu caso y te enviamos una propuesta en un día hábil.</p>
          <ButtonLink href="#contacto">Solicitar cotización</ButtonLink>
          <ButtonLink href={`https://wa.me/${EMPRESA.whatsapp}`} variant="secundario">
            Escríbenos por WhatsApp
          </ButtonLink>
          <p className="border-t border-linea pt-4 text-sm text-tinta-suave">
            {EMPRESA.telefono} · {EMPRESA.horario}
          </p>
        </aside>
      </div>
    </main>
  );
}
