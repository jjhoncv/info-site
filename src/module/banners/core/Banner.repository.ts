import { executeQuery, type Consulta } from "@/src/lib/db";
import type { BannerRow } from "@/src/types/database";
import type { BannerSeed } from "./Banner.seed";

class BannerRepository {
  async getBanners(): Promise<BannerRow[]> {
    return executeQuery<BannerRow[]>("SELECT * FROM banners ORDER BY position, id");
  }

  async getVisibleBanners(): Promise<BannerRow[]> {
    return executeQuery<BannerRow[]>("SELECT * FROM banners WHERE visible = 1 ORDER BY position, id");
  }

  // Vacía la tabla y carga la semilla en su orden, con ids 1..n fijos. DELETE y no TRUNCATE:
  // TRUNCATE es DDL y puede fallar con la conexión de la app en la base real (TiDB).
  // Corre con la `consulta` de una transacción: el que llama decide el commit.
  async restoreSeed(semilla: BannerSeed[], consulta: Consulta): Promise<void> {
    await consulta("DELETE FROM banners");
    const fila = "(?, ?, ?, ?, ?, ?, ?)";
    const params = semilla.flatMap((b, i) => [i + 1, b.title, b.subtitle, b.imageUrl, b.imageAlt, i + 1, b.visible ? 1 : 0]);
    await consulta(
      `INSERT INTO banners (id, title, subtitle, image_url, image_alt, position, visible) VALUES ${semilla.map(() => fila).join(", ")}`,
      params,
    );
  }
}

const bannerRepository = new BannerRepository();
export default bannerRepository;
