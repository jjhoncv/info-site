import type { Service } from "@/src/types/domain";
import type { ServiceRow } from "@/src/types/database";

// `null` de la BD → `undefined` en el dominio.
const opcional = <T>(valor: T | null): T | undefined => valor ?? undefined;

// Según el motor, JSON llega ya convertido o como texto.
const comoLista = (valor: string[] | string): string[] => (typeof valor === "string" ? JSON.parse(valor) : valor);

export function ServiceMapper(raw: ServiceRow): Service {
  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    summary: raw.summary,
    description: raw.description,
    includes: comoLista(raw.includes),
    imageUrl: opcional(raw.image_url),
    imageAlt: opcional(raw.image_alt),
    position: raw.position,
    metaTitle: opcional(raw.meta_title),
    metaDescription: opcional(raw.meta_description),
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    createdBy: opcional(raw.created_by),
    updatedBy: opcional(raw.updated_by),
  };
}

export const ServicesMapper = (raws: ServiceRow[]): Service[] => raws.map(ServiceMapper);
