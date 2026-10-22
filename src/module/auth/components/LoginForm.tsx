"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../core/login.action";

const CAMPO =
  "w-full rounded-tarjeta border border-linea bg-white px-4 py-3 text-base text-tinta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento-600";

export function LoginForm() {
  const [estado, accion, enviando] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={accion} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-2">
        <label htmlFor="username" className="text-sm font-semibold text-marca-900">
          Usuario
        </label>
        <input id="username" name="username" type="text" autoComplete="username" required className={CAMPO} />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-semibold text-marca-900">
          Clave
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={CAMPO} />
      </div>
      {estado.error && (
        <p role="alert" className="text-sm font-semibold text-red-700">
          {estado.error}
        </p>
      )}
      <button
        type="submit"
        disabled={enviando}
        className="inline-flex items-center justify-center rounded-tarjeta bg-acento-600 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-acento-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento-600 disabled:opacity-60"
      >
        {enviando ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
