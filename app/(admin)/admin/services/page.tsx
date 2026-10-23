import type { Metadata } from "next";
import { ButtonLink } from "@/src/components/Button";
import { ServiceListView } from "@/src/module/services/components/admin/ServiceListView";
import { serviceModel } from "@/src/module/services/core";
import { PageUI } from "@/src/module/shared/components/PageUI";

export const metadata: Metadata = { title: "Servicios · Administración", robots: { index: false } };

// Lee de MySQL en cada visita; el proxy ya exige sesión en /admin/*.
export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const servicios = await serviceModel.getServices();
  return (
    <PageUI
      title="Servicios"
      subtitle="Lo que ofreces. Esto es lo que se ve en la página de servicios."
      action={<ButtonLink href="/admin/services/new">Nuevo servicio</ButtonLink>}
    >
      <ServiceListView services={servicios} />
    </PageUI>
  );
}
