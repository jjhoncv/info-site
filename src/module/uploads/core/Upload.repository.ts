import { executeQuery, type Consulta } from "@/src/lib/db";

type Escritura = { affectedRows: number; insertId: number };

// Solo SQL. Una fila (id = 1) cuenta las imágenes subidas desde la última restauración.
class UploadRepository {
  /** Suma una imagen solo si no se llegó al tope. `false` si ya estaba lleno. */
  async reserve(limit: number): Promise<boolean> {
    const r = await executeQuery<Escritura>("UPDATE upload_counter SET total = total + 1 WHERE id = 1 AND total < ?", [limit]);
    return r.affectedRows === 1;
  }

  async release(): Promise<void> {
    await executeQuery<Escritura>("UPDATE upload_counter SET total = total - 1 WHERE id = 1 AND total > 0");
  }

  // Corre con la `consulta` de una transacción: el que llama decide el commit.
  async reset(consulta: Consulta): Promise<void> {
    await consulta("UPDATE upload_counter SET total = 0 WHERE id = 1");
  }

  async count(): Promise<number> {
    const filas = await executeQuery<{ total: number }[]>("SELECT total FROM upload_counter WHERE id = 1");
    return Number(filas[0]?.total ?? 0);
  }
}

const uploadRepository = new UploadRepository();
export default uploadRepository;
