"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sessionOptions, type SessionData } from "./session";

export async function logout(): Promise<void> {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions());
  session.destroy();
  redirect("/login");
}
