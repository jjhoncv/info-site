import type { Metadata } from "next";
import { serviceModel } from "@/src/module/services/core";
import { SummaryView } from "@/src/module/shared/components/SummaryView";

export const metadata: Metadata = { title: "Resumen · Administración", robots: { index: false } };

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const servicios = await serviceModel.getServices();
  return <SummaryView servicesCount={servicios.length} />;
}
