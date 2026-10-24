import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ProjectImageRow, ProjectRow } from "@/src/types/database";

const repo = vi.hoisted(() => ({
  getProjects: vi.fn(),
  getProjectBySlug: vi.fn(),
  getImagesByProjectIds: vi.fn(),
  restoreSeed: vi.fn(),
}));
vi.mock("../core/Project.repository", () => ({ default: repo }));

import { ProjectModel } from "../core/Project.model";
import { PROJECTS_SEED } from "../core/Project.seed";

const fila = (id: number, status: string) => ({ id, title: `P${id}`, slug: `p${id}`, status, meta_title: null }) as unknown as ProjectRow;
const foto = (id: number, project_id: number, position: number) =>
  ({ id, project_id, image_url: `/demo/${id}.jpg`, image_alt: `Foto ${id}`, position }) as ProjectImageRow;

describe("ProjectModel", () => {
  beforeEach(() => vi.resetAllMocks());

  it("getPublishedProjects trae solo publicados, cada uno con sus fotos en orden", async () => {
    repo.getProjects.mockResolvedValue([fila(1, "published"), fila(2, "published")]);
    repo.getImagesByProjectIds.mockResolvedValue([foto(10, 1, 1), foto(11, 2, 1), foto(12, 1, 2)]);
    const proyectos = await new ProjectModel().getPublishedProjects();
    expect(repo.getProjects).toHaveBeenCalledWith(true);
    expect(repo.getImagesByProjectIds).toHaveBeenCalledWith([1, 2]);
    expect(proyectos.map((p) => p.images.map((i) => i.id))).toEqual([[10, 12], [11]]);
  });

  it("getPublishedProjects sin proyectos devuelve una lista vacía", async () => {
    repo.getProjects.mockResolvedValue([]);
    repo.getImagesByProjectIds.mockResolvedValue([]);
    expect(await new ProjectModel().getPublishedProjects()).toEqual([]);
  });

  it("getPublishedProjectBySlug devuelve el proyecto con sus fotos", async () => {
    repo.getProjectBySlug.mockResolvedValue(fila(1, "published"));
    repo.getImagesByProjectIds.mockResolvedValue([foto(10, 1, 1)]);
    const proyecto = await new ProjectModel().getPublishedProjectBySlug("p1");
    expect(proyecto).toMatchObject({ id: 1, slug: "p1" });
    expect(proyecto?.images).toHaveLength(1);
  });

  it("getPublishedProjectBySlug devuelve null si no existe", async () => {
    repo.getProjectBySlug.mockResolvedValue(null);
    expect(await new ProjectModel().getPublishedProjectBySlug("no-existe")).toBeNull();
  });

  it("getPublishedProjectBySlug devuelve null si es borrador", async () => {
    repo.getProjectBySlug.mockResolvedValue(fila(3, "draft"));
    expect(await new ProjectModel().getPublishedProjectBySlug("p3")).toBeNull();
    expect(repo.getImagesByProjectIds).not.toHaveBeenCalled();
  });

  it("restoreSeed vuelve a cargar la semilla", async () => {
    const consulta = vi.fn();
    await new ProjectModel().restoreSeed(consulta);
    expect(repo.restoreSeed).toHaveBeenCalledWith(PROJECTS_SEED, consulta);
  });
});
