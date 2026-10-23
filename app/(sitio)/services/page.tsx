import type { Metadata } from "next";
import { EMPRESA } from "@/src/components/empresa";
import { ServicesHero } from "@/src/module/services/components/web/ServicesHero";
import { ServicesLanding } from "@/src/module/services/components/web/ServicesLanding";

// Lee de MySQL en cada visita: lo que se edita en el admin se ve de inmediato.
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: `Servicios · ${EMPRESA.nombre}` };

export default function ServicesPage() {
  return <ServicesLanding encabezado={<ServicesHero />} />;
}
