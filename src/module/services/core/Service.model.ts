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

  // PATCH: solo cambia lo que llega; lo demás (p. ej. la imagen, que el formulario aún no toca) se conserva.
  async updateService(id: number, cambios: Partial<ServiceInput>, userId: number): Promise<Service | null> {
    const actual = await this.getServiceById(id);
    if (!actual) return null;
    const { title, slug, summary, description, includes, imageUrl, imageAlt, metaTitle, metaDescription } = actual;
    const datos = ServiceSchema.parse({
      title, slug, summary, description, includes, imageUrl, imageAlt, metaTitle, metaDescription,
      ...cambios,
    });
    const fila = await repository.updateService(id, datos, userId);
    return fila ? ServiceMapper(fila) : null;
  }

  async deleteService(id: number): Promise<boolean> {
    return repository.deleteService(id);
  }
}

const serviceModel = new ServiceModel();
export default serviceModel;
