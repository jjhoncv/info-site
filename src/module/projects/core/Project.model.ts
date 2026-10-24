import type { Consulta } from "@/src/lib/db";
import type { ProjectWithImages } from "../services/types";
import repository from "./Project.repository";
import { ProjectImagesMapper, ProjectMapper, ProjectsMapper } from "./Project.mapper";
import { PROJECTS_SEED } from "./Project.seed";

export class ProjectModel {
  // Solo los publicados, cada uno con su galería en orden.
  async getPublishedProjects(): Promise<ProjectWithImages[]> {
    const proyectos = ProjectsMapper(await repository.getProjects(true));
    const fotos = ProjectImagesMapper(await repository.getImagesByProjectIds(proyectos.map((p) => p.id)));
    return proyectos.map((p) => ({ ...p, images: fotos.filter((f) => f.projectId === p.id) }));
  }

  // Un borrador es como si no existiera: devuelve null (la página da 404).
  async getPublishedProjectBySlug(slug: string): Promise<ProjectWithImages | null> {
    const fila = await repository.getProjectBySlug(slug);
    if (!fila || fila.status !== "published") return null;
    const proyecto = ProjectMapper(fila);
    const images = ProjectImagesMapper(await repository.getImagesByProjectIds([proyecto.id]));
    return { ...proyecto, images };
  }

  // «Restaurar demo»: deja los proyectos y sus fotos como en la semilla.
  async restoreSeed(consulta: Consulta): Promise<void> {
    await repository.restoreSeed(PROJECTS_SEED, consulta);
  }
}

const projectModel = new ProjectModel();
export default projectModel;
