"use client";

import { useActionState } from "react";
import { Button } from "@/src/components/Button";
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
        <p role="alert" className="text-sm font-semibold text-error">
          {estado.error}
        </p>
      )}
      <Button type="submit" disabled={enviando}>
        {enviando ? "Entrando…" : "Entrar"}
      </Button>
      <p className="flex gap-2.5 rounded-tarjeta bg-marca-50 px-3.5 py-3 text-sm text-marca-800">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mt-0.5 size-[18px] flex-none"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 8h.01" />
        </svg>
        <span>Por seguridad, después de 5 intentos fallidos el acceso se bloquea 15 minutos.</span>
      </p>
    </form>
  );
}
