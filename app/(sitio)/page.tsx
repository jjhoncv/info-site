import type { Metadata } from "next";
import { EMPRESA } from "@/src/components/empresa";
import { BannerCarousel } from "@/src/module/banners/components/web/BannerCarousel";
import { bannerModel } from "@/src/module/banners/core";
import { ServicesHero } from "@/src/module/services/components/web/ServicesHero";
import { ServicesLanding } from "@/src/module/services/components/web/ServicesLanding";

// Lee de MySQL en cada visita: lo que se edita en el admin se ve de inmediato.
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: EMPRESA.nombre };

// Portada: arriba el carrusel de banners visibles; sin ninguno, el encabezado de servicios. Debajo, los servicios.
export default async function HomePage() {
  const banners = await bannerModel.getVisibleBanners();
  return <ServicesLanding encabezado={banners.length > 0 ? <BannerCarousel banners={banners} /> : <ServicesHero />} />;
}
