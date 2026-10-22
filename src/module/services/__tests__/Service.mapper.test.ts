import { describe, expect, it } from "vitest";
import type { ServiceRow } from "@/src/types/database";
import { ServiceMapper, ServicesMapper } from "../core/Service.mapper";

const fila: ServiceRow = {
  id: 1,
  title: "Asesoría personalizada",
  slug: "asesoria-personalizada",
  summary: "Resumen",
  description: "Descripción",
  includes: ["Uno", "Dos"],
  image_url: "/demo/a.jpg",
  image_alt: "Dos personas",
  position: 1,
  meta_title: "Meta",
  meta_description: null,
  created_at: new Date("2026-10-20T10:00:00Z"),
  updated_at: new Date("2026-10-21T10:00:00Z"),
  created_by: null,
  updated_by: 7,
};

describe("ServiceMapper", () => {
  it("pasa de snake_case (BD) a camelCase (dominio)", () => {
    const servicio = ServiceMapper(fila);
    expect(servicio).toMatchObject({ id: 1, imageUrl: "/demo/a.jpg", imageAlt: "Dos personas", metaTitle: "Meta", updatedBy: 7 });
    expect(servicio.createdAt).toEqual(fila.created_at);
  });

  it("convierte los null de la BD en undefined", () => {
    const servicio = ServiceMapper(fila);
    expect(servicio.metaDescription).toBeUndefined();
    expect(servicio.createdBy).toBeUndefined();
  });

  it("acepta `includes` como texto JSON (TiDB puede devolverlo así)", () => {
    const servicio = ServiceMapper({ ...fila, includes: '["Uno","Dos"]' as unknown as string[] });
    expect(servicio.includes).toEqual(["Uno", "Dos"]);
  });

  it("ServicesMapper convierte una lista", () => {
    expect(ServicesMapper([fila, { ...fila, id: 2 }]).map((s) => s.id)).toEqual([1, 2]);
  });
});
