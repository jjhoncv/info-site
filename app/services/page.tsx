import type { Metadata } from "next";
import { ServiceCard } from "@/src/module/services/components/web/ServiceCard";
import { getServicios } from "@/src/module/services/services/demo";

export const metadata: Metadata = { title: "Servicios · Info Site" };

export default function ServicesPage() {
  return (
    <main>
      <section className="bg-marca-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-acento-700">Lo que hacemos</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-marca-900 sm:text-5xl">Servicios</h1>
          <p className="mt-4 max-w-2xl text-lg text-tinta-suave">
            Un equipo que se ocupa de lo administrativo para que tú te dediques a tu negocio.
          </p>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {getServicios().map((servicio) => (
          <ServiceCard key={servicio.slug} service={servicio} />
        ))}
      </section>
    </main>
  );
}
