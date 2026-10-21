import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/src/components/Button";
import { ServiceIllustration } from "@/src/module/services/components/web/ServiceIllustration";
import { getServicioBySlug } from "@/src/module/services/services/demo";

type Props = Readonly<{ params: Promise<{ slug: string }> }>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const servicio = getServicioBySlug((await params).slug);
  return { title: servicio ? `${servicio.title} · Info Site` : "No encontramos esta página" };
}

export default async function ServiceDetailPage({ params }: Props) {
  const servicio = getServicioBySlug((await params).slug);
  if (!servicio) notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link href="/services" className="text-sm font-semibold text-marca-700 hover:underline">
        ← Todos los servicios
      </Link>
      <div className="mt-6 grid items-center gap-10 md:grid-cols-2">
        <div className="flex flex-col gap-5">
          <h1 className="text-4xl font-extrabold tracking-tight text-marca-900 sm:text-5xl">{servicio.title}</h1>
          <p className="text-lg text-tinta-suave">{servicio.description}</p>
          <div>
            <ButtonLink href="/services" variant="secundario">
              Ver otros servicios
            </ButtonLink>
          </div>
        </div>
        <div className="overflow-hidden rounded-tarjeta shadow-tarjeta">
          <ServiceIllustration type={servicio.illustration} label={`Ilustración de ${servicio.title}`} />
        </div>
      </div>
    </main>
  );
}
