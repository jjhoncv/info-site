import Link from "next/link";
import type { Servicio } from "../../services/types";
import { ServiceIllustration } from "./ServiceIllustration";

export function ServiceCard({ service }: Readonly<{ service: Servicio }>) {
  return (
    <article className="flex flex-col overflow-hidden rounded-tarjeta bg-white shadow-tarjeta transition-colors hover:bg-marca-50">
      <ServiceIllustration type={service.illustration} label={`Ilustración de ${service.title}`} />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h2 className="text-lg font-bold text-marca-900">{service.title}</h2>
        <p className="text-tinta-suave">{service.summary}</p>
        <Link
          href={`/services/${service.slug}`}
          aria-label={`Ver ${service.title}`}
          className="font-semibold text-marca-700 hover:underline"
        >
          Ver servicio →
        </Link>
      </div>
    </article>
  );
}
