import { executeQuery, type Consulta } from "@/src/lib/db";
import type { ProjectImageRow, ProjectRow } from "@/src/types/database";
import type { ProjectSeed } from "./Project.seed";

class ProjectRepository {
  // `soloPublicados`: el sitio nunca ve los borradores.
  async getProjects(soloPublicados = false): Promise<ProjectRow[]> {
    const donde = soloPublicados ? "WHERE status = 'published'" : "";
    return executeQuery<ProjectRow[]>(`SELECT * FROM projects ${donde} ORDER BY position, id`);
  }

  async getProjectBySlug(slug: string): Promise<ProjectRow | null> {
    const filas = await executeQuery<ProjectRow[]>("SELECT * FROM projects WHERE slug = ?", [slug]);
    return filas[0] ?? null;
  }

  // Fotos de varios proyectos en una sola consulta, en el orden de la galería.
  async getImagesByProjectIds(ids: number[]): Promise<ProjectImageRow[]> {
    if (ids.length === 0) return [];
    const marcas = ids.map(() => "?").join(", ");
    return executeQuery<ProjectImageRow[]>(
      `SELECT * FROM project_images WHERE project_id IN (${marcas}) ORDER BY project_id, position, id`,
      ids,
    );
  }

  // Vacía las tablas y carga la semilla en su orden, con ids 1..n fijos (mismo criterio que servicios).
  // Corre con la `consulta` de una transacción: el que llama decide el commit.
  async restoreSeed(semilla: ProjectSeed[], consulta: Consulta): Promise<void> {
    await consulta("DELETE FROM project_images");
    await consulta("DELETE FROM projects");
    const fila = "(?, ?, ?, ?, ?, ?, ?)";
    const proyectos = semilla.flatMap((p, i) => [i + 1, p.title, p.slug, p.summary, p.description, p.status, i + 1]);
    await consulta(
      `INSERT INTO projects (id, title, slug, summary, description, status, position) VALUES ${semilla.map(() => fila).join(", ")}`,
      proyectos,
    );
    const fotos = semilla.flatMap((p, i) => p.images.map((f, j) => [i + 1, f.imageUrl, f.imageAlt, j + 1]));
    await consulta(
      `INSERT INTO project_images (project_id, image_url, image_alt, position) VALUES ${fotos.map(() => "(?, ?, ?, ?)").join(", ")}`,
      fotos.flat(),
    );
  }
}

const projectRepository = new ProjectRepository();
export default projectRepository;
