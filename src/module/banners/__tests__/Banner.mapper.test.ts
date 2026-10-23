import { describe, expect, it } from "vitest";
import type { BannerRow } from "@/src/types/database";
import { BannerMapper, BannersMapper } from "../core/Banner.mapper";

const fila: BannerRow = {
  id: 1,
  title: "Tu empresa, en buenas manos",
  subtitle: "Atención cercana",
  image_url: "/demo/portada.jpg",
  image_alt: "Dos personas conversan",
  position: 1,
  visible: 1,
  created_at: new Date("2026-10-20T10:00:00Z"),
  updated_at: new Date("2026-10-21T10:00:00Z"),
  created_by: null,
  updated_by: 7,
};

describe("BannerMapper", () => {
  it("pasa de snake_case (BD) a camelCase (dominio)", () => {
    const banner = BannerMapper(fila);
    expect(banner).toMatchObject({ id: 1, imageUrl: "/demo/portada.jpg", imageAlt: "Dos personas conversan", updatedBy: 7 });
    expect(banner.createdAt).toEqual(fila.created_at);
  });

  it("convierte los null de la BD en undefined", () => {
    expect(BannerMapper(fila).createdBy).toBeUndefined();
  });

  it("convierte visible (0/1) en booleano", () => {
    expect(BannerMapper(fila).visible).toBe(true);
    expect(BannerMapper({ ...fila, visible: 0 }).visible).toBe(false);
  });

  it("BannersMapper convierte una lista", () => {
    expect(BannersMapper([fila, { ...fila, id: 2 }]).map((b) => b.id)).toEqual([1, 2]);
  });
});
