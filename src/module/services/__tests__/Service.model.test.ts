import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ServiceRow } from "@/src/types/database";

const repo = vi.hoisted(() => ({
  getServices: vi.fn(),
  getServiceById: vi.fn(),
  getServiceBySlug: vi.fn(),
  createService: vi.fn(),
  updateService: vi.fn(),
  deleteService: vi.fn(),
}));
vi.mock("../core/Service.repository", () => ({ default: repo }));

import { ServiceModel } from "../core/Service.model";

const fila = { id: 1, title: "Asesoría personalizada", slug: "asesoria-personalizada", includes: [], image_url: null } as unknown as ServiceRow;

describe("ServiceModel", () => {
  beforeEach(() => vi.resetAllMocks());

  it("getServices devuelve servicios de dominio", async () => {
    repo.getServices.mockResolvedValue([fila]);
    const servicios = await new ServiceModel().getServices();
    expect(servicios[0]).toMatchObject({ id: 1, title: "Asesoría personalizada", imageUrl: undefined });
  });

  it("getServiceBySlug devuelve null si no existe", async () => {
    repo.getServiceBySlug.mockResolvedValue(null);
    expect(await new ServiceModel().getServiceBySlug("no-existe")).toBeNull();
    expect(repo.getServiceBySlug).toHaveBeenCalledWith("no-existe");
  });

  it("getServiceBySlug mapea el servicio encontrado", async () => {
    repo.getServiceBySlug.mockResolvedValue(fila);
    expect((await new ServiceModel().getServiceBySlug("asesoria-personalizada"))?.slug).toBe("asesoria-personalizada");
  });

  it("getServiceById devuelve null si no existe", async () => {
    repo.getServiceById.mockResolvedValue(null);
    expect(await new ServiceModel().getServiceById(9)).toBeNull();
  });

  it("createService valida con el esquema antes de llegar al repository", async () => {
    await expect(new ServiceModel().createService({ title: "" } as never, 1)).rejects.toThrow();
    expect(repo.createService).not.toHaveBeenCalled();
  });

  it("createService guarda con el usuario de la sesión y devuelve el servicio", async () => {
    repo.createService.mockResolvedValue(fila);
    const datos = { title: "T", slug: "t", summary: "r", description: "d", includes: [] };
    const creado = await new ServiceModel().createService(datos, 3);
    expect(repo.createService).toHaveBeenCalledWith(datos, 3);
    expect(creado.id).toBe(1);
  });
});
