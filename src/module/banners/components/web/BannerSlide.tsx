import Image from "next/image";
import type { Banner } from "../../services/types";

type Props = Readonly<{ banner: Banner; posicion: number; total: number; activo: boolean }>;

// Un banner: foto con un velo `marca-900` de izquierda a derecha, título en serif y frase. Sin botones dentro.
// El primero lleva el h1 de la portada y su imagen carga con prioridad (es lo primero que se ve).
export function BannerSlide({ banner, posicion, total, activo }: Props) {
  const Titulo = posicion === 0 ? "h1" : "h2";
  return (
    <div
      role="group"
      aria-roledescription="banner"
      aria-label={`${posicion + 1} de ${total}`}
      hidden={!activo}
      className="relative isolate grid min-h-[clamp(22rem,52vw,34rem)] data-[inactivo]:hidden"
      data-inactivo={activo ? undefined : ""}
    >
      <Image
        src={banner.imageUrl}
        alt={banner.imageAlt}
        fill
        priority={posicion === 0}
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-marca-900/90 via-marca-900/70 via-45% to-marca-900/15" />
      <div className="mx-auto flex w-full max-w-6xl flex-col justify-center gap-4 px-4 pb-24 pt-12 sm:px-6">
        <Titulo className="max-w-[14ch] text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl">{banner.title}</Titulo>
        <p className="max-w-[34ch] text-xl text-marca-100">{banner.subtitle}</p>
      </div>
    </div>
  );
}
