import { executeQuery } from "@/src/lib/db";
import type { ServiceRow } from "@/src/types/database";
import type { ServiceInput } from "./Service.schema";
import type { ServiceSeed } from "./Service.seed";

type Escritura = { affectedRows: number; insertId: number };

// Lista permitida: solo estas columnas se escriben (nunca el body completo).
const COLUMNAS: [keyof ServiceInput, string][] = [
  ["title", "title"],
  ["slug", "slug"],
  ["summary", "summary"],
  ["description", "description"],
  ["includes", "includes"],
  ["imageUrl", "image_url"],
  ["imageAlt", "image_alt"],
  ["metaTitle", "meta_title"],
  ["metaDescription", "meta_description"],
];

const valores = (datos: ServiceInput) =>
  COLUMNAS.map(([clave]) => {
    const valor = datos[clave];
    return clave === "includes" ? JSON.stringify(valor) : (valor ?? null);
  });

class ServiceRepository {
  async getServices(): Promise<ServiceRow[]> {
    return executeQuery<ServiceRow[]>("SELECT * FROM services ORDER BY position, id");
  }

  async getServiceById(id: number): Promise<ServiceRow | null> {
    const filas = await executeQuery<ServiceRow[]>("SELECT * FROM services WHERE id = ?", [id]);
    return filas[0] ?? null;
  }

  async getServiceBySlug(slug: string): Promise<ServiceRow | null> {
    const filas = await executeQuery<ServiceRow[]>("SELECT * FROM services WHERE slug = ?", [slug]);
    return filas[0] ?? null;
  }

  async createService(datos: ServiceInput, userId: number): Promise<ServiceRow | null> {
    const columnas = COLUMNAS.map(([, columna]) => columna);
    const sql = `INSERT INTO services (${columnas.join(", ")}, created_by, updated_by) VALUES (${[...columnas, "", ""].map(() => "?").join(", ")})`;
    const { insertId } = await executeQuery<Escritura>(sql, [...valores(datos), userId, userId]);
    return this.getServiceById(insertId);
  }

  async updateService(id: number, datos: ServiceInput, userId: number): Promise<ServiceRow | null> {
    const asignaciones = COLUMNAS.map(([, columna]) => `${columna} = ?`).join(", ");
    await executeQuery(`UPDATE services SET ${asignaciones}, updated_by = ? WHERE id = ?`, [...valores(datos), userId, id]);
    return this.getServiceById(id);
  }

  async deleteService(id: number): Promise<boolean> {
    const { affectedRows } = await executeQuery<Escritura>("DELETE FROM services WHERE id = ?", [id]);
    return affectedRows > 0;
  }

  // Vacía la tabla y carga la semilla en su orden, con ids 1..n fijos. DELETE y no TRUNCATE:
  // TRUNCATE es DDL y puede fallar con la conexión de la app en la base real (TiDB).
  async restoreSeed(semilla: ServiceSeed[]): Promise<void> {
    await executeQuery("DELETE FROM services");
    const fila = "(?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const params = semilla.flatMap((s, i) => [i + 1, s.title, s.slug, s.summary, s.description, JSON.stringify(s.includes), s.imageUrl, s.imageAlt, i + 1]);
    await executeQuery(
      `INSERT INTO services (id, title, slug, summary, description, includes, image_url, image_alt, position) VALUES ${semilla.map(() => fila).join(", ")}`,
      params,
    );
  }
}

const serviceRepository = new ServiceRepository();
export default serviceRepository;
