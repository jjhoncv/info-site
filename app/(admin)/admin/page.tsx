import type { Metadata } from "next";
import { serviceModel } from "@/src/module/services/core";
import { MAX_UPLOADS, uploadModel } from "@/src/module/uploads/core";
import { SummaryView } from "@/src/module/shared/components/SummaryView";

export const metadata: Metadata = { title: "Resumen · Administración", robots: { index: false } };

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [servicios, subidas] = await Promise.all([serviceModel.getServices(), uploadModel.countImages()]);
  return <SummaryView servicesCount={servicios.length} uploadsCount={subidas} uploadsLimit={MAX_UPLOADS} />;
}
