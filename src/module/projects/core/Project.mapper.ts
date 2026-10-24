import type { Project, ProjectImage } from "@/src/types/domain";
import type { ProjectImageRow, ProjectRow } from "@/src/types/database";

// `null` de la BD → `undefined` en el dominio.
const opcional = <T>(valor: T | null): T | undefined => valor ?? undefined;

export function ProjectMapper(raw: ProjectRow): Project {
  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    summary: raw.summary,
    description: raw.description,
    status: raw.status,
    position: raw.position,
    metaTitle: opcional(raw.meta_title),
    metaDescription: opcional(raw.meta_description),
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    createdBy: opcional(raw.created_by),
    updatedBy: opcional(raw.updated_by),
  };
}

export const ProjectsMapper = (raws: ProjectRow[]): Project[] => raws.map(ProjectMapper);

export const ProjectImageMapper = (raw: ProjectImageRow): ProjectImage => ({
  id: raw.id,
  projectId: raw.project_id,
  imageUrl: raw.image_url,
  imageAlt: raw.image_alt,
  position: raw.position,
});

export const ProjectImagesMapper = (raws: ProjectImageRow[]): ProjectImage[] => raws.map(ProjectImageMapper);
