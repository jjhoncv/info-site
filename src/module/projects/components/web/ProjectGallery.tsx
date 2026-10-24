"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import type { ProjectImage } from "../../services/types";

// Foto grande + miniaturas. La primera foto es la portada del proyecto.
// Las flechas ← → recorren la galería (y dan la vuelta) mientras el foco está en las miniaturas.
export function ProjectGallery({ images }: Readonly<{ images: ProjectImage[] }>) {
  const [actual, setActual] = useState(0);
  const botones = useRef<(HTMLButtonElement | null)[]>([]);
  if (images.length === 0) return null;

  const ir = (indice: number) => {
    const siguiente = (indice + images.length) % images.length;
    setActual(siguiente);
    return siguiente;
  };

  const alTeclear = (evento: KeyboardEvent) => {
    if (evento.key !== "ArrowRight" && evento.key !== "ArrowLeft") return;
    evento.preventDefault();
    botones.current[ir(actual + (evento.key === "ArrowRight" ? 1 : -1))]?.focus();
  };

  const foto = images[actual];
  return (
    <figure className="m-0 grid gap-3">
      <div className="relative aspect-[3/2] overflow-hidden rounded-tarjeta bg-marca-50">
        <Image
          src={foto.imageUrl}
          alt={foto.imageAlt}
          fill
          priority
          sizes="(min-width: 768px) 640px, 100vw"
          className="object-cover"
        />
        <span className="absolute bottom-3 right-3 rounded-full bg-marca-900/85 px-2.5 py-1 text-xs font-semibold text-white">
          {actual + 1} / {images.length}
        </span>
      </div>
      <figcaption className="text-sm text-tinta-suave">{foto.imageAlt}</figcaption>
      <ul aria-label="Fotos del proyecto" onKeyDown={alTeclear} className="m-0 grid list-none grid-cols-4 gap-2 p-0">
        {images.map((imagen, i) => (
          <li key={imagen.id}>
            <button
              type="button"
              ref={(el) => {
                botones.current[i] = el;
              }}
              aria-label={`Ver foto ${i + 1}: ${imagen.imageAlt}`}
              aria-current={i === actual}
              onClick={() => ir(i)}
              className="relative block aspect-[3/2] w-full cursor-pointer overflow-hidden rounded-tarjeta border-2 border-transparent bg-marca-50 opacity-70 hover:opacity-100 aria-[current=true]:border-acento-600 aria-[current=true]:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento-600"
            >
              <Image src={imagen.imageUrl} alt="" fill sizes="160px" className="object-cover" />
            </button>
          </li>
        ))}
      </ul>
    </figure>
  );
}
