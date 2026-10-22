import type { Service } from "@/src/types/domain";
import repository from "./Service.repository";
import { ServiceMapper, ServicesMapper } from "./Service.mapper";
import { ServiceSchema, type ServiceInput } from "./Service.schema";

export class ServiceModel {
  async getServices(): Promise<Service[]> {
    return ServicesMapper(await repository.getServices());
  }

  async getServiceById(id: number): Promise<Service | null> {
    const fila = await repository.getServiceById(id);
    return fila ? ServiceMapper(fila) : null;
  }

  async getServiceBySlug(slug: string): Promise<Service | null> {
    const fila = await repository.getServiceBySlug(slug);
    return fila ? ServiceMapper(fila) : null;
  }

  async createService(datos: ServiceInput, userId: number): Promise<Service> {
    const fila = await repository.createService(ServiceSchema.parse(datos), userId);
    if (!fila) throw new Error("No se pudo crear el servicio");
    return ServiceMapper(fila);
  }

  async updateService(id: number, datos: ServiceInput, userId: number): Promise<Service | null> {
    const fila = await repository.updateService(id, ServiceSchema.parse(datos), userId);
    return fila ? ServiceMapper(fila) : null;
  }

  async deleteService(id: number): Promise<boolean> {
    return repository.deleteService(id);
  }
}

const serviceModel = new ServiceModel();
export default serviceModel;
