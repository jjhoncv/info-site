import type { Metadata } from "next";
import { ServiceForm } from "@/src/module/services/components/admin/ServiceForm";
import { PageUI } from "@/src/module/shared/components/PageUI";

export const metadata: Metadata = { title: "Nuevo servicio · Administración", robots: { index: false } };

export default function NewServicePage() {
  return (
    <PageUI title="Nuevo servicio" subtitle="Los campos con * son obligatorios.">
      <ServiceForm />
    </PageUI>
  );
}
