"use client";

import type { Field } from "../types";
import { useImageUpload } from "./useImageUpload";

const UPLOAD_API = "/api/admin/uploads";

type Props = { field: Field; value: string; onValue: (url: string) => void };

// Zona para elegir la imagen, vista previa y el motivo si el servidor no la aceptó.
export function ImageField({ field, value, onValue }: Readonly<Props>) {
  const { key, label, help } = field;
  const { subir, error, subiendo } = useImageUpload(UPLOAD_API, onValue);
  const mensaje = `${key}-mensaje`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={key} className="text-sm font-semibold text-marca-900">
        {label}
      </label>
      <div className="flex flex-wrap items-start gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element -- vista previa de una ruta propia, sin optimizar */}
        {value && <img src={value} alt="Vista previa de la imagen" className="h-28 w-40 rounded-tarjeta object-cover" />}
        <input
          id={key}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-describedby={mensaje}
          aria-invalid={error ? true : undefined}
          disabled={subiendo}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void subir(file);
            e.target.value = "";
          }}
          className="max-w-full text-base text-tinta file:mr-3 file:rounded-tarjeta file:border file:border-linea file:bg-white file:px-4 file:py-2 file:font-semibold"
        />
      </div>
      <p id={mensaje} className="text-sm text-tinta-suave">
        {subiendo ? "Subiendo la imagen…" : help}
      </p>
      {error && (
        <p role="alert" className="text-sm font-semibold text-error">
          {error}
        </p>
      )}
    </div>
  );
}
