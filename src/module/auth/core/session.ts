import { unsealData, type SessionOptions } from "iron-session";

export const COOKIE_NAME = "info-site-sesion";
const DURACION_SEGUNDOS = 60 * 60 * 8;

// Hay un solo usuario (el demo): su id es el que queda en created_by / updated_by.
export const DEMO_USER_ID = 1;

export type SessionData = { isAdmin?: boolean };

// La opción se arma al usarla: SESSION_SECRET se lee en ejecución, no en el build.
export function sessionOptions(): SessionOptions {
  return {
    password: process.env.SESSION_SECRET ?? "",
    cookieName: COOKIE_NAME,
    ttl: DURACION_SEGUNDOS,
    cookieOptions: { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" },
  };
}

// Lee la sesión desde el valor crudo de la cookie. Cualquier fallo (sin cookie, manipulada,
// otro secreto, sin SESSION_SECRET) es «sin sesión», nunca un error.
export async function readSession(cookie: string | undefined): Promise<SessionData> {
  const password = process.env.SESSION_SECRET ?? "";
  if (!cookie || password.length < 32) return {};
  try {
    return await unsealData<SessionData>(cookie, { password, ttl: DURACION_SEGUNDOS });
  } catch {
    return {};
  }
}

export async function hasAdminSession(cookie: string | undefined): Promise<boolean> {
  return (await readSession(cookie)).isAdmin === true;
}
