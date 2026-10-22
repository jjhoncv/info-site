import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/src/components/Button";
import { EMPRESA } from "@/src/components/empresa";
import { serviceModel } from "@/src/module/services/core";

// Lee de MySQL en cada visita: lo que se edita en el admin se ve de inmediato.
export const dynamic = "force-dynamic";

type Props = Readonly<{ params: Promise<{ slug: string }> }>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const servicio = await serviceModel.getServiceBySlug((await params).slug);
  if (!servicio) return { title: "No encontramos esta página" };
  return {
    title: `${servicio.metaTitle ?? servicio.title} · ${EMPRESA.nombre}`,
    description: servicio.metaDescription ?? servicio.summary,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const servicio = await serviceModel.getServiceBySlug((await params).slug);
  if (!servicio) notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
      <nav aria-label="Ruta" className="text-sm text-tinta-suave">
        <Link href="/services" className="hover:text-marca-700">
          Servicios
        </Link>{" "}
        / <span className="text-tinta">{servicio.title}</span>
      </nav>
      <div className="mt-6 grid items-start gap-10 md:grid-cols-[1.6fr_1fr]">
        <article className="flex flex-col gap-6">
          <h1 className="text-4xl font-bold leading-tight text-marca-900 sm:text-5xl">{servicio.title}</h1>
          <p className="text-xl leading-relaxed text-tinta-suave">{servicio.summary}</p>
          {servicio.imageUrl && (
            <div className="relative aspect-[3/2] overflow-hidden rounded-tarjeta">
              <Image
                src={servicio.imageUrl}
                alt={servicio.imageAlt ?? ""}
                fill
                priority
                sizes="(min-width: 768px) 640px, 100vw"
                className="object-cover"
              />
            </div>
          )}
          <p className="text-lg leading-relaxed">{servicio.description}</p>
          <div>
            <h2 className="text-2xl font-bold text-marca-900">Qué incluye</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {servicio.includes.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-acento-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
        <aside className="flex flex-col gap-4 rounded-tarjeta bg-fondo-calido p-7 md:sticky md:top-6">
          <h2 className="text-2xl font-bold text-marca-900">¿Te interesa?</h2>
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
