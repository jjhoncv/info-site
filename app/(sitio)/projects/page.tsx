import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/src/components/Button";
import { EMPRESA } from "@/src/components/empresa";
import { ProjectCard } from "@/src/module/projects/components/web/ProjectCard";
import { projectModel } from "@/src/module/projects/core";

// Lee de MySQL en cada visita: lo que se edita en el admin se ve de inmediato.
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: `Proyectos · ${EMPRESA.nombre}` };

export default async function ProjectsPage() {
  const proyectos = await projectModel.getPublishedProjects();
  return (
    <main>
      <section className="bg-fondo-calido">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 py-14 sm:px-6 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-acento-700">Proyectos</p>
          <h1 className="max-w-[20ch] text-4xl font-bold leading-tight text-marca-900 sm:text-5xl">Trabajos que ya entregamos</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-tinta-suave">
            Algunos de los proyectos que hicimos con nuestros clientes. Cada uno con su galería de fotos.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {proyectos.map((proyecto) => (
            <ProjectCard key={proyecto.slug} project={proyecto} />
          ))}
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-marca-900">
        <Image src="/demo/local.jpg" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-15" />
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-5 px-4 py-16 sm:px-6">
          <h2 className="max-w-2xl text-3xl font-bold text-white sm:text-4xl">¿Tienes un proyecto parecido?</h2>
          <p className="max-w-xl text-lg text-marca-100">Cuéntanos qué necesitas y te enviamos una propuesta en un día hábil.</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="#contacto">Solicitar cotización</ButtonLink>
            <ButtonLink href={`https://wa.me/${EMPRESA.whatsapp}`} variant="claro">
              Escríbenos por WhatsApp
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
