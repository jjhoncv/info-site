import { describe, expect, it } from "vitest";
import { getServicioBySlug, getServicios } from "../services/demo";

describe("servicios de demo", () => {
  it("incluye «Asesoría contable» con su slug", () => {
    expect(getServicios().map((s) => s.slug)).toContain("asesoria-contable");
    expect(getServicioBySlug("asesoria-contable")?.title).toBe("Asesoría contable");
  });

  it("devuelve undefined si el servicio no existe", () => {
    expect(getServicioBySlug("no-existe")).toBeUndefined();
  });

  it("cada servicio tiene slug único, descripción y una ilustración conocida", () => {
    const servicios = getServicios();
    expect(new Set(servicios.map((s) => s.slug)).size).toBe(servicios.length);
    for (const s of servicios) {
      expect(s.description.length).toBeGreaterThan(20);
      expect(["contabilidad", "legal", "consultoria", "impuestos", "nomina", "auditoria"]).toContain(s.illustration);
    }
  });
});
