import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ServiceSchema } from "../core/Service.schema";
import { SERVICES_SEED } from "../core/Service.seed";

const migracion = readFileSync("db/migraciones/002-semilla-servicios.sql", "utf8");

describe("semilla de servicios", () => {
  it("es la misma de la migración 002", () => {
    const filas = migracion.match(/^ {2}\('/gm) ?? [];
    expect(SERVICES_SEED).toHaveLength(filas.length);
    for (const s of SERVICES_SEED) {
      for (const texto of [s.title, s.slug, s.summary, s.description, s.imageUrl, s.imageAlt]) expect(migracion).toContain(texto);
      expect(migracion).toContain(JSON.stringify(s.includes).replaceAll('","', '", "'));
    }
  });

  it("cumple el esquema de servicios y usa fotos del repo", () => {
    for (const s of SERVICES_SEED) {
      expect(() => ServiceSchema.parse(s)).not.toThrow();
      expect(s.imageUrl).toMatch(/^\/demo\/servicios\//);
    }
  });
});
