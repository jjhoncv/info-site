"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { COOKIE_NAME, hasAdminSession } from "@/src/module/auth/core/session";
import { restoreDemo } from "./restoreDemo";

export type RestoreResult = { ok: true } | { ok: false; error: string };

// Acción del botón «Restaurar demo». Verifica la sesión aquí: una acción es un endpoint público.
export async function restoreDemoAction(): Promise<RestoreResult> {
  const cookie = (await cookies()).get(COOKIE_NAME)?.value;
  if (!(await hasAdminSession(cookie))) return { ok: false, error: "Tu sesión venció. Inicia sesión de nuevo." };
  try {
    await restoreDemo();
  } catch (error) {
    // El detalle va al log; quien llama recibe un mensaje genérico.
    console.error("No se pudo restaurar la demo:", error);
    return { ok: false, error: "No se pudo restaurar la demo. Intenta de nuevo." };
  }
  revalidatePath("/", "layout");
  return { ok: true };
}
