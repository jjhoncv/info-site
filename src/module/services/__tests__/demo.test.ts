import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// La semilla de la demo es la migración 002: sus fotos tienen que existir en public/.
const semilla = readFileSync(join(process.cwd(), "db/migraciones/002-semilla-servicios.sql"), "utf8");

describe("semilla de servicios de la demo", () => {
  it("incluye «Asesoría personalizada» con su slug", () => {
    expect(semilla).toContain("'Asesoría personalizada', 'asesoria-personalizada'");
  });

  it("cada foto de la semilla existe en public/", () => {
    const fotos = semilla.match(/'\/demo\/[^']+'/g)?.map((f) => f.slice(1, -1)) ?? [];
    expect(fotos.length).toBeGreaterThanOrEqual(6);
    for (const foto of fotos) expect(existsSync(join(process.cwd(), "public", foto)), foto).toBe(true);
  });
});
