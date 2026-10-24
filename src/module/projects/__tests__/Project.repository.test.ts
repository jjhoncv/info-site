import { beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({ executeQuery: vi.fn() }));
vi.mock("@/src/lib/db", () => db);

import repository from "../core/Project.repository";
import { PROJECTS_SEED } from "../core/Project.seed";

describe("ProjectRepository", () => {
  beforeEach(() => vi.resetAllMocks());

  it("getProjects(true) filtra por publicados y ordena por posición", async () => {
    db.executeQuery.mockResolvedValue([]);
    await repository.getProjects(true);
    expect(db.executeQuery.mock.calls[0][0]).toContain("WHERE status = 'published'");
    expect(db.executeQuery.mock.calls[0][0]).toContain("ORDER BY position, id");
  });

  it("getProjects() sin filtro trae todos", async () => {
    db.executeQuery.mockResolvedValue([]);
    await repository.getProjects();
    expect(db.executeQuery.mock.calls[0][0]).not.toContain("WHERE");
  });

  it("getProjectBySlug usa `?` y devuelve null si no hay fila", async () => {
    db.executeQuery.mockResolvedValue([]);
    expect(await repository.getProjectBySlug("no-existe")).toBeNull();
    expect(db.executeQuery).toHaveBeenCalledWith("SELECT * FROM projects WHERE slug = ?", ["no-existe"]);
  });

  it("getImagesByProjectIds no consulta sin ids y ordena la galería por posición", async () => {
    expect(await repository.getImagesByProjectIds([])).toEqual([]);
    expect(db.executeQuery).not.toHaveBeenCalled();
    db.executeQuery.mockResolvedValue([]);
    await repository.getImagesByProjectIds([1, 2]);
    expect(db.executeQuery.mock.calls[0][0]).toContain("IN (?, ?)");
    expect(db.executeQuery.mock.calls[0][0]).toContain("ORDER BY project_id, position, id");
    expect(db.executeQuery.mock.calls[0][1]).toEqual([1, 2]);
  });

  it("restoreSeed borra fotos y proyectos, y carga la semilla con ids 1..n", async () => {
    const consulta = vi.fn();
    await repository.restoreSeed(PROJECTS_SEED, consulta);
    const sqls = consulta.mock.calls.map(([sql]) => sql as string);
    expect(sqls[0]).toBe("DELETE FROM project_images");
    expect(sqls[1]).toBe("DELETE FROM projects");
    expect(sqls[2]).toContain("INSERT INTO projects");
    expect(sqls[3]).toContain("INSERT INTO project_images");
    const fotos = consulta.mock.calls[3][1] as unknown[];
    expect(fotos).toHaveLength(PROJECTS_SEED.flatMap((p) => p.images).length * 4);
    expect(fotos.slice(0, 4)).toEqual([1, PROJECTS_SEED[0].images[0].imageUrl, PROJECTS_SEED[0].images[0].imageAlt, 1]);
  });
});
