import { withTransaction } from "@/src/lib/db";
import { bannerModel } from "@/src/module/banners/core";
import { serviceModel } from "@/src/module/services/core";
import { uploadModel } from "@/src/module/uploads/core";

// Deja la demo como al inicio: servicios y banners de la semilla, contador en cero e imágenes subidas fuera.
// Todo o nada: servicios, banners y contador van en una transacción; las imágenes se borran solo después del commit.
// No toca al usuario demo ni su clave. Es la misma función que usará la restauración nocturna (T16).
export async function restoreDemo(): Promise<void> {
  await withTransaction(async (consulta) => {
    await serviceModel.restoreSeed(consulta);
    await bannerModel.restoreSeed(consulta);
    await uploadModel.resetCounter(consulta);
  });
  await uploadModel.deleteImages();
}
