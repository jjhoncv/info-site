"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyCredentials } from "./credentials";
import { loginSchema } from "./login.schema";
import { sessionOptions, type SessionData } from "./session";

export type LoginState = { error?: string };

// Destino fijo: nunca se redirige a una URL que venga del visitante.
const DESTINO = "/admin/services";

export async function login(_previo: LoginState, formData: FormData): Promise<LoginState> {
  const datos = loginSchema.safeParse({ username: formData.get("username"), password: formData.get("password") });
  if (!datos.success) return { error: datos.error.issues[0].message };
  if (!(await verifyCredentials(datos.data.username, datos.data.password))) {
    return { error: "Usuario o clave incorrectos" };
  }
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions());
  session.isAdmin = true;
  await session.save();
  redirect(DESTINO);
}
