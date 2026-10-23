import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { BANNERS_SEED } from "../core/Banner.seed";

const migracion = readFileSync("db/migraciones/006-semilla-banners.sql", "utf8");

describe("semilla de banners", () => {
  it("es la misma de la migración 006", () => {
    const filas = migracion.match(/^ {2}\('/gm) ?? [];
    expect(BANNERS_SEED).toHaveLength(filas.length);
    for (const b of BANNERS_SEED) {
      for (const texto of [b.title, b.subtitle, b.imageUrl, b.imageAlt]) expect(migracion).toContain(texto);
    }
  });

  it("son los 3 banners de la maqueta: solo «Capacítate con nosotros» está oculto", () => {
    expect(BANNERS_SEED.map((b) => [b.title, b.visible])).toEqual([
      ["Tu empresa, en buenas manos", true],
      ["Planes para empresas", true],
      ["Capacítate con nosotros", false],
    ]);
  });

  it("respeta los largos de la tabla y usa fotos que existen en public/demo", () => {
    for (const b of BANNERS_SEED) {
      expect(b.title.length).toBeLessThanOrEqual(120);
      expect(b.subtitle.length).toBeLessThanOrEqual(160);
      expect(b.imageAlt.length).toBeLessThanOrEqual(200);
      expect(b.imageAlt).not.toBe("");
      expect(existsSync(`public${b.imageUrl}`)).toBe(true);
    }
  });
});
