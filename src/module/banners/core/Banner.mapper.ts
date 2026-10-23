import type { Banner } from "@/src/types/domain";
import type { BannerRow } from "@/src/types/database";

// `null` de la BD → `undefined` en el dominio.
const opcional = <T>(valor: T | null): T | undefined => valor ?? undefined;

export function BannerMapper(raw: BannerRow): Banner {
  return {
    id: raw.id,
    title: raw.title,
    subtitle: raw.subtitle,
    imageUrl: raw.image_url,
    imageAlt: raw.image_alt,
    position: raw.position,
    visible: Boolean(raw.visible),
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    createdBy: opcional(raw.created_by),
    updatedBy: opcional(raw.updated_by),
  };
}

export const BannersMapper = (raws: BannerRow[]): Banner[] => raws.map(BannerMapper);
