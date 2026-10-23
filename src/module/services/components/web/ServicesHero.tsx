import Image from "next/image";
import { ButtonLink } from "@/src/components/Button";
import { EMPRESA } from "@/src/components/empresa";

// Encabezado de /services; la portada lo usa cuando no hay banners visibles.
export function ServicesHero() {
  return (
    <section className="bg-fondo-calido">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.1fr_1fr] md:py-20">
        <div className="flex flex-col gap-5">
          <p className="text-sm font-semibold uppercase tracking-widest text-acento-700">Nuestros servicios</p>
          <h1 className="text-4xl font-bold leading-tight text-marca-900 sm:text-5xl">
            Soluciones a la medida de tu negocio
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-tinta-suave">
            Te acompañamos desde la primera consulta hasta después de la entrega, con un equipo que responde y
            precios claros desde el inicio.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <ButtonLink href="#contacto">Solicitar cotización</ButtonLink>
            <ButtonLink href={`https://wa.me/${EMPRESA.whatsapp}`} variant="secundario">
              Escríbenos por WhatsApp
            </ButtonLink>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-tarjeta">
          <Image
            src="/demo/portada.jpg"
            alt="Dos personas conversan en una oficina luminosa"
            fill
            priority
            sizes="(min-width: 768px) 520px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
