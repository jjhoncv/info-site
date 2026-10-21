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
    <main>
      <section className="bg-marca-900">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <Link href="/services" className="text-sm text-marca-100 hover:text-white">
            ← Todos los servicios
          </Link>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">{servicio.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-marca-100">{servicio.summary}</p>
        </div>
      </section>
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-tarjeta shadow-tarjeta">
            <ServiceIllustration type={servicio.illustration} label={`Ilustración de ${servicio.title}`} />
          </div>
          <p className="text-lg text-tinta-suave">{servicio.description}</p>
        </div>
        <aside className="rounded-tarjeta bg-marca-50 p-7">
          <h2 className="text-xl font-bold text-marca-900">¿Te interesa?</h2>
          <p className="mb-5 mt-2 text-tinta-suave">Cuéntanos tu caso y te respondemos en un día hábil.</p>
          <ButtonLink href="/services" variant="secundario">
            Ver otros servicios
          </ButtonLink>
        </aside>
      </div>
    </main>
  );
}
