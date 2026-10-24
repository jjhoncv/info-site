import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ServiceRow } from "@/src/types/database";

const repo = vi.hoisted(() => ({
  getServices: vi.fn(),
  getServiceById: vi.fn(),
  getServiceBySlug: vi.fn(),
  createService: vi.fn(),
  updateService: vi.fn(),
  deleteService: vi.fn(),
  restoreSeed: vi.fn(),
}));
vi.mock("../core/Service.repository", () => ({ default: repo }));

import { ServiceModel } from "../core/Service.model";
import { ServiceMapper } from "../core/Service.mapper";
import { ServiceSchema } from "../core/Service.schema";
import { SERVICES_SEED } from "../core/Service.seed";

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

  it("restoreSeed vuelve a cargar la semilla", async () => {
    const consulta = vi.fn();
    await new ServiceModel().restoreSeed(consulta);
    expect(repo.restoreSeed).toHaveBeenCalledWith(SERVICES_SEED, consulta);
  });

  describe("updateService", () => {
    const completa = {
      ...fila,
      slug: "a",
      title: "A",
      summary: "r",
      description: "d",
      image_url: "/demo/a.jpg",
      image_alt: "Foto",
      meta_title: "Meta",
    } as unknown as ServiceRow;

    it("conserva lo que no llega (imagen) y guarda con el usuario de la sesión", async () => {
      repo.getServiceById.mockResolvedValue(completa);
      repo.updateService.mockResolvedValue(completa);
      await new ServiceModel().updateService(1, { title: "Nuevo" }, 3);
      expect(repo.updateService).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ title: "Nuevo", slug: "a", imageUrl: "/demo/a.jpg", imageAlt: "Foto" }),
        3,
      );
    });

    it("un opcional que llega en blanco se borra", async () => {
      repo.getServiceById.mockResolvedValue(completa);
      repo.updateService.mockResolvedValue(completa);
      await new ServiceModel().updateService(1, ServiceSchema.partial().parse({ metaTitle: "" }), 3);
      expect(repo.updateService.mock.calls[0][1].metaTitle).toBeUndefined();
    });

    it("conserva TODOS los campos del esquema que no llegan (un campo nuevo no se borra al editar)", async () => {
      repo.getServiceById.mockResolvedValue(completa);
      repo.updateService.mockResolvedValue(completa);
      await new ServiceModel().updateService(1, {}, 3);
      const guardado = repo.updateService.mock.calls[0][1];
      const actual = ServiceMapper(completa);
      for (const campo of Object.keys(ServiceSchema.shape)) {
        expect(guardado[campo], `se perdió «${campo}» al editar`).toEqual(actual[campo as keyof typeof actual]);
      }
    });

    it("devuelve null si el servicio no existe", async () => {
      repo.getServiceById.mockResolvedValue(null);
      expect(await new ServiceModel().updateService(9, { title: "X" }, 3)).toBeNull();
      expect(repo.updateService).not.toHaveBeenCalled();
    });

    it("rechaza cambios que el esquema no admite", async () => {
      repo.getServiceById.mockResolvedValue(completa);
      await expect(new ServiceModel().updateService(1, { title: "" }, 3)).rejects.toThrow();
      expect(repo.updateService).not.toHaveBeenCalled();
    });
  });
});
