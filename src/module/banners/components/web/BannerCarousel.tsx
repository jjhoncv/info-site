"use client";

import type { Banner } from "../../services/types";
import { BannerControls } from "./BannerControls";
import { BannerSlide } from "./BannerSlide";
import { useBannerCarousel } from "./useBannerCarousel";

// Carrusel de la portada: los banners visibles, de a uno. Sin banners no se dibuja nada.
export function BannerCarousel({ banners }: Readonly<{ banners: Banner[] }>) {
  const c = useBannerCarousel(banners.length);
  if (banners.length === 0) return null;
  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Banners"
      data-testid="carrusel-banners"
      className="relative overflow-hidden bg-marca-900 text-white"
      {...c.enEncima}
    >
      {banners.map((banner, i) => (
        <BannerSlide key={banner.id} banner={banner} posicion={i} total={banners.length} activo={i === c.actual} />
      ))}
      {banners.length > 1 && (
        <BannerControls
          banners={banners}
          actual={c.actual}
          pausado={c.pausado}
          puedePausar={!c.quieto}
          onAnterior={c.anterior}
          onSiguiente={c.siguiente}
          onPausa={c.alternarPausa}
          onIr={c.ir}
        />
      )}
    </section>
  );
}
