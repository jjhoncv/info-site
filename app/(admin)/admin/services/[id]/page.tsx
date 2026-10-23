import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceForm } from "@/src/module/services/components/admin/ServiceForm";
import { serviceModel } from "@/src/module/services/core";
import { PageUI } from "@/src/module/shared/components/PageUI";

export const metadata: Metadata = { title: "Editar servicio · Administración", robots: { index: false } };

// Lee de MySQL en cada visita; el proxy ya exige sesión en /admin/*.
export const dynamic = "force-dynamic";

export default async function EditServicePage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const id = Number((await params).id);
  const servicio = Number.isInteger(id) && id > 0 ? await serviceModel.getServiceById(id) : null;
  if (!servicio) notFound();
  return (
    <PageUI title="Editar servicio" subtitle="Los campos con * son obligatorios.">
      <ServiceForm service={servicio} />
    </PageUI>
  );
}
