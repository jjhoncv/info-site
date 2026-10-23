import { beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({ executeQuery: vi.fn() }));
vi.mock("@/src/lib/db", () => db);

import repository from "../core/Service.repository";
import { SERVICES_SEED } from "../core/Service.seed";

describe("ServiceRepository", () => {
  beforeEach(() => vi.resetAllMocks());

  it("getServices ordena por posición", async () => {
    db.executeQuery.mockResolvedValue([{ id: 1 }]);
    expect(await repository.getServices()).toEqual([{ id: 1 }]);
    expect(db.executeQuery.mock.calls[0][0]).toMatch(/FROM services ORDER BY position/);
  });

  it("getServiceBySlug usa ? y devuelve null si no hay filas", async () => {
    db.executeQuery.mockResolvedValue([]);
    expect(await repository.getServiceBySlug("x'; DROP TABLE services; --")).toBeNull();
    const [sql, params] = db.executeQuery.mock.calls[0];
    expect(sql).toContain("WHERE slug = ?");
    expect(sql).not.toContain("DROP");
    expect(params).toEqual(["x'; DROP TABLE services; --"]);
  });

  it("getServiceById devuelve la fila", async () => {
    db.executeQuery.mockResolvedValue([{ id: 4 }]);
    expect(await repository.getServiceById(4)).toEqual({ id: 4 });
  });

  it("createService inserta solo columnas conocidas, con auditoría", async () => {
    db.executeQuery.mockResolvedValueOnce({ insertId: 8 }).mockResolvedValueOnce([{ id: 8 }]);
    const creado = await repository.createService(
      { title: "T", slug: "t", summary: "r", description: "d", includes: ["a"] },
      3,
    );
    const [sql, params] = db.executeQuery.mock.calls[0];
    expect(sql).toMatch(/INSERT INTO services \(.*created_by, updated_by\)/);
    expect(params).toContain(JSON.stringify(["a"]));
    expect(params.slice(-2)).toEqual([3, 3]);
    expect(creado).toEqual({ id: 8 });
  });

  it("deleteService borra por id", async () => {
    db.executeQuery.mockResolvedValue({ affectedRows: 1 });
    expect(await repository.deleteService(2)).toBe(true);
    expect(db.executeQuery).toHaveBeenCalledWith("DELETE FROM services WHERE id = ?", [2]);
  });

  it("restoreSeed vacía la tabla y vuelve a insertar la semilla en su orden", async () => {
    db.executeQuery.mockResolvedValue({ affectedRows: 6 });
    await repository.restoreSeed(SERVICES_SEED);
    expect(db.executeQuery.mock.calls[0][0]).toBe("DELETE FROM services");
    const [sql, params] = db.executeQuery.mock.calls[1];
    expect(sql).toMatch(/^INSERT INTO services \(id, .*position\) VALUES/);
    expect(sql.match(/\(\?, \?, \?, \?, \?, \?, \?, \?, \?\)/g)).toHaveLength(SERVICES_SEED.length);
    expect(params).toHaveLength(SERVICES_SEED.length * 9);
    expect(params.slice(0, 9)).toEqual([
      1,
      "Asesoría personalizada",
      "asesoria-personalizada",
      expect.any(String),
      expect.any(String),
      JSON.stringify(SERVICES_SEED[0].includes),
      "/demo/servicios/asesoria-personalizada.jpg",
      expect.any(String),
      1,
    ]);
  });
});
