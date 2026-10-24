// Tipos que consume el sitio público: vienen de los tipos generados de la BD (npm run db:types).
import type { Project, ProjectImage } from "@/src/types/domain";

export type { Project, ProjectImage };

// Un proyecto con su galería; la primera foto es la portada.
export type ProjectWithImages = Project & { images: ProjectImage[] };
