import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PROJECTS_SEED } from "../core/Project.seed";

const migracion = readFileSync("db/migraciones/005-crear-proyectos.sql", "utf8");

describe("semilla de proyectos", () => {
  it("es la misma de la migración 005", () => {
    const proyectos = migracion.match(/^ {2}\('[^']+', '[^']+',$/gm) ?? [];
    expect(PROJECTS_SEED).toHaveLength(proyectos.length);
    const fotos = migracion.match(/^ {2}\(\d+, '/gm) ?? [];
    expect(PROJECTS_SEED.flatMap((p) => p.images)).toHaveLength(fotos.length);
    PROJECTS_SEED.forEach((p, i) => {
      for (const texto of [p.title, p.slug, p.summary, p.description]) expect(migracion).toContain(texto);
      expect(migracion).toContain(`'${p.status}', ${i + 1})`);
      p.images.forEach((f, j) => expect(migracion).toContain(`(${i + 1}, '${f.imageUrl}', '${f.imageAlt}', ${j + 1})`));
    });
  });

  it("tiene los 4 proyectos de la maqueta con sus fotos y estado", () => {
    expect(PROJECTS_SEED.map((p) => [p.title, p.images.length, p.status])).toEqual([
      ["Proyecto Grupo Andino", 4, "published"],
      ["Renovación de sede central", 6, "published"],
      ["Programa de capacitación anual", 3, "draft"],
      ["Soporte a 40 sucursales", 5, "published"],
    ]);
  });

  it("cada foto tiene descripción y existe en public/", () => {
    for (const f of PROJECTS_SEED.flatMap((p) => p.images)) {
      expect(f.imageAlt.length).toBeGreaterThan(0);
      expect(existsSync(`public${f.imageUrl}`), f.imageUrl).toBe(true);
    }
  });
});
