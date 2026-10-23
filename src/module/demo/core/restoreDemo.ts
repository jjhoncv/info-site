import { serviceModel } from "@/src/module/services/core";
import { uploadModel } from "@/src/module/uploads/core";

// Deja la demo como al inicio: imágenes subidas fuera, contador en cero y servicios de la semilla.
// No toca al usuario demo ni su clave. Es la misma función que usará la restauración nocturna (T16).
export async function restoreDemo(): Promise<void> {
  await uploadModel.deleteAll();
  await serviceModel.restoreSeed();
}
