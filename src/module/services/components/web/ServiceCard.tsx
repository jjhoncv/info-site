import Image from "next/image";
import Link from "next/link";
import type { Servicio } from "../../services/types";

export function ServiceCard({ service }: Readonly<{ service: Servicio }>) {
  return (
    <article className="group flex flex-col">
      <Link
        href={`/services/${service.slug}`}
        aria-label={`Ver ${service.title}`}
        className="flex flex-1 flex-col gap-4 rounded-tarjeta focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acento-600"
      >
        <div className="relative aspect-[3/2] overflow-hidden rounded-tarjeta bg-marca-50">
          <Image
            src={service.image}
            alt={service.imageAlt}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-marca-900">{service.title}</h2>
          <p className="leading-relaxed text-tinta-suave">{service.summary}</p>
          <span className="mt-1 text-sm font-semibold text-acento-700">Ver detalle →</span>
        </div>
      </Link>
    </article>
  );
}
