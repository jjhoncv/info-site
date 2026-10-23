import { beforeEach, describe, expect, it, vi } from "vitest";
import type { BannerRow } from "@/src/types/database";

const repository = vi.hoisted(() => ({ getBanners: vi.fn(), getVisibleBanners: vi.fn(), restoreSeed: vi.fn() }));
vi.mock("../core/Banner.repository", () => ({ default: repository }));

import { BannerModel } from "../core/Banner.model";
import { BANNERS_SEED } from "../core/Banner.seed";

const fila = (id: number, visible: number): BannerRow => ({
  id,
  title: `Banner ${id}`,
  subtitle: "Frase",
  image_url: "/demo/portada.jpg",
  image_alt: "Descripción",
  position: id,
  visible,
  created_at: new Date(),
  updated_at: new Date(),
  created_by: null,
  updated_by: null,
});

const modelo = new BannerModel();

beforeEach(() => vi.resetAllMocks());

describe("BannerModel", () => {
  it("getBanners devuelve todos, en tipos de dominio", async () => {
    repository.getBanners.mockResolvedValue([fila(1, 1), fila(2, 0)]);
    const banners = await modelo.getBanners();
    expect(banners.map((b) => [b.title, b.visible])).toEqual([["Banner 1", true], ["Banner 2", false]]);
  });

  it("getVisibleBanners devuelve solo los visibles que entrega el repository", async () => {
    repository.getVisibleBanners.mockResolvedValue([fila(1, 1)]);
    const banners = await modelo.getVisibleBanners();
    expect(banners).toHaveLength(1);
    expect(banners[0]).toMatchObject({ title: "Banner 1", imageUrl: "/demo/portada.jpg", visible: true });
  });

  it("sin banners visibles devuelve una lista vacía", async () => {
    repository.getVisibleBanners.mockResolvedValue([]);
    expect(await modelo.getVisibleBanners()).toEqual([]);
  });

  it("restoreSeed carga la semilla con la consulta de la transacción", async () => {
    const consulta = vi.fn();
    await modelo.restoreSeed(consulta);
    expect(repository.restoreSeed).toHaveBeenCalledWith(BANNERS_SEED, consulta);
  });
});
