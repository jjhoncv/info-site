import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getServicioBySlug, getServicios } from "../services/demo";

describe("servicios de demo", () => {
  it("incluye «Asesoría personalizada» con su slug", () => {
    expect(getServicios().map((s) => s.slug)).toContain("asesoria-personalizada");
    expect(getServicioBySlug("asesoria-personalizada")?.title).toBe("Asesoría personalizada");
  });

  it("devuelve undefined si el servicio no existe", () => {
    expect(getServicioBySlug("no-existe")).toBeUndefined();
  });

  it("cada servicio tiene slug único, descripción, qué incluye y una foto que existe con su texto alternativo", () => {
    const servicios = getServicios();
    expect(new Set(servicios.map((s) => s.slug)).size).toBe(servicios.length);
    for (const s of servicios) {
      expect(s.description.length).toBeGreaterThan(20);
      expect(s.includes.length).toBeGreaterThan(0);
      expect(s.imageAlt.length).toBeGreaterThan(10);
      expect(existsSync(join(process.cwd(), "public", s.image)), s.image).toBe(true);
    }
  });
});
