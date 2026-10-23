import { describe, expect, it } from "vitest";
import { ServiceSchema } from "../core/Service.schema";

const valido = {
  title: "Asesoría personalizada",
  slug: "asesoria-personalizada",
  summary: "Resumen corto",
  description: "Descripción del servicio",
  includes: ["Diagnóstico"],
};

const mensajes = (datos: unknown) => {
  const r = ServiceSchema.safeParse(datos);
  return r.success ? [] : r.error.issues.map((i) => i.message);
};

describe("ServiceSchema", () => {
  it("acepta un servicio completo", () => {
    expect(ServiceSchema.safeParse(valido).success).toBe(true);
  });

  it("exige el título con su mensaje", () => {
    expect(mensajes({ ...valido, title: "" })).toContain("El título es obligatorio");
    expect(mensajes({ ...valido, title: undefined })).toContain("El título es obligatorio");
  });

  it("exige slug en minúsculas y guiones", () => {
    expect(mensajes({ ...valido, slug: "Con Espacios" })).toContain("El slug solo admite minúsculas, números y guiones");
  });

  it("exige resumen y descripción", () => {
    expect(mensajes({ ...valido, summary: "" })).toContain("El resumen es obligatorio");
    expect(mensajes({ ...valido, description: "" })).toContain("La descripción es obligatoria");
  });

  it("limita el largo de los textos", () => {
    expect(mensajes({ ...valido, title: "a".repeat(151) })).toContain("El título admite hasta 150 caracteres");
    expect(mensajes({ ...valido, metaTitle: "a".repeat(71) })).toContain("El meta título admite hasta 70 caracteres");
  });

  it("deja fuera los campos que no define (created_by, id…)", () => {
    const r = ServiceSchema.parse({ ...valido, createdBy: 99, id: 5 });
    expect(r).not.toHaveProperty("createdBy");
    expect(r).not.toHaveProperty("id");
  });

  it("un opcional en blanco queda sin valor, pero con la clave presente (para poder borrarlo en un PATCH)", () => {
    const r = ServiceSchema.partial().parse({ metaTitle: "  " });
    expect(r.metaTitle).toBeUndefined();
    expect(Object.hasOwn(r, "metaTitle")).toBe(true);
  });
});
