import { describe, expect, it } from "vitest";
import type { ProjectImageRow, ProjectRow } from "@/src/types/database";
import { ProjectImagesMapper, ProjectMapper, ProjectsMapper } from "../core/Project.mapper";

const fila: ProjectRow = {
  id: 1,
  title: "Proyecto Grupo Andino",
  slug: "proyecto-grupo-andino",
  summary: "Resumen",
  description: "Descripción",
  status: "published",
  position: 1,
  meta_title: "Meta",
  meta_description: null,
  created_at: new Date("2026-10-20T10:00:00Z"),
  updated_at: new Date("2026-10-21T10:00:00Z"),
  created_by: null,
  updated_by: 7,
};

const foto: ProjectImageRow = { id: 5, project_id: 1, image_url: "/demo/a.jpg", image_alt: "Dos personas", position: 2 };

describe("ProjectMapper", () => {
  it("pasa de snake_case (BD) a camelCase (dominio)", () => {
    const proyecto = ProjectMapper(fila);
    expect(proyecto).toMatchObject({ id: 1, status: "published", metaTitle: "Meta", updatedBy: 7 });
    expect(proyecto.createdAt).toEqual(fila.created_at);
  });

  it("convierte los null de la BD en undefined", () => {
    const proyecto = ProjectMapper(fila);
    expect(proyecto.metaDescription).toBeUndefined();
    expect(proyecto.createdBy).toBeUndefined();
  });

  it("ProjectsMapper convierte una lista", () => {
    expect(ProjectsMapper([fila, { ...fila, id: 2 }]).map((p) => p.id)).toEqual([1, 2]);
  });

  it("ProjectImagesMapper convierte las fotos", () => {
    expect(ProjectImagesMapper([foto])).toEqual([
      { id: 5, projectId: 1, imageUrl: "/demo/a.jpg", imageAlt: "Dos personas", position: 2 },
    ]);
  });
});
