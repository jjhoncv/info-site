import type { ReactNode } from "react";
import Image from "next/image";
import { ButtonLink } from "@/src/components/Button";
import { EMPRESA } from "@/src/components/empresa";
import { serviceModel } from "../../core";
import { ServiceCard } from "./ServiceCard";

// Cifras de ejemplo: dan confianza y cada cliente pone las suyas.
const CIFRAS = [
  { valor: "15 años", texto: "de experiencia" },
  { valor: "1 200+", texto: "clientes atendidos" },
  { valor: "24 h", texto: "para responderte" },
  { valor: "4,9 / 5", texto: "en satisfacción" },
];

const PASOS = [
  { titulo: "Nos cuentas tu necesidad", texto: "Por teléfono, WhatsApp o en una visita, sin compromiso." },
  { titulo: "Te enviamos una propuesta", texto: "Con alcance, precio y plazo por escrito, en un día hábil." },
  { titulo: "Lo hacemos y te acompañamos", texto: "Cumplimos lo acordado y seguimos disponibles después." },
];

// Página de servicios: un encabezado (el hero de /services o el carrusel de la portada) y, debajo, lo mismo.
export async function ServicesLanding({ encabezado }: Readonly<{ encabezado: ReactNode }>) {
  const servicios = await serviceModel.getServices();
  return (
    <main>
      {encabezado}

      <section aria-label="Cifras" className="border-b border-linea">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-y-6 px-4 py-8 sm:px-6 md:grid-cols-4">
          {CIFRAS.map((c) => (
            <div key={c.texto} className="flex flex-col gap-1">
              <dt className="order-2 text-sm text-tinta-suave">{c.texto}</dt>
              <dd className="order-1 font-titulo text-3xl font-bold text-marca-900">{c.valor}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="max-w-xl text-3xl font-bold text-marca-900">Elige el servicio que necesitas</h2>
        <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {servicios.map((servicio) => (
            <ServiceCard key={servicio.slug} service={servicio} />
          ))}
        </div>
      </section>

      <section className="bg-marca-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl font-bold text-marca-900">Cómo trabajamos</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {PASOS.map((p, i) => (
              <li key={p.titulo} className="flex gap-4">
                <span className="font-titulo text-3xl font-bold text-acento-600" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-marca-900">{p.titulo}</h3>
                  <p className="mt-1 leading-relaxed text-tinta-suave">{p.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-marca-900">
        <Image src="/demo/local.jpg" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-15" />
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-5 px-4 py-16 sm:px-6">
          <h2 className="max-w-2xl text-3xl font-bold text-white sm:text-4xl">¿Listo para empezar? Te respondemos hoy.</h2>
          <p className="max-w-xl text-lg text-marca-100">
            {EMPRESA.horario}. También por WhatsApp al {EMPRESA.telefono}.
          </p>
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
