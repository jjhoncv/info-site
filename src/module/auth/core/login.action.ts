"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyCredentials } from "./credentials";
import loginAttemptModel from "./LoginAttempt.model";
import { loginSchema } from "./login.schema";
import { sessionOptions, type SessionData } from "./session";

export type LoginState = { error?: string };

const BLOQUEADO = "Demasiados intentos; espera 15 minutos";

// Destino fijo: nunca se redirige a una URL que venga del visitante.
const DESTINO = "/admin/services";

export async function login(_previo: LoginState, formData: FormData): Promise<LoginState> {
  const datos = loginSchema.safeParse({ username: formData.get("username"), password: formData.get("password") });
  if (!datos.success) return { error: datos.error.issues[0].message };
  const { username, password } = datos.data;
  // Bloqueado: ni se mira la clave, aunque sea la correcta.
  if (await loginAttemptModel.isBlocked(username)) return { error: BLOQUEADO };
  if (!(await verifyCredentials(username, password))) {
    await loginAttemptModel.recordFailure(username);
    return { error: (await loginAttemptModel.isBlocked(username)) ? BLOQUEADO : "Usuario o clave incorrectos" };
  }
  await loginAttemptModel.clear(username);
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions());
  session.isAdmin = true;
  await session.save();
  redirect(DESTINO);
}
