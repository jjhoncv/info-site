"use client";

import { useState } from "react";

const UPLOAD_API = "/api/admin/uploads";
const ERROR_GENERICO = "No se pudo subir la imagen; intenta de nuevo";

// Sube el archivo elegido al servidor, que decide si es válido. Devuelve la URL o muestra el motivo.
export function useImageUpload(onUploaded: (url: string) => void) {
  const [error, setError] = useState<string>();
  const [subiendo, setSubiendo] = useState(false);

  const subir = async (archivo: File) => {
    setError(undefined);
    setSubiendo(true);
    try {
      const cuerpo = new FormData();
      cuerpo.set("file", archivo);
      const res = await fetch(UPLOAD_API, { method: "POST", body: cuerpo });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) return setError(json.error ?? ERROR_GENERICO);
      onUploaded(json.data.url);
    } catch {
      setError(ERROR_GENERICO);
    } finally {
      setSubiendo(false);
    }
  };

  return { subir, error, subiendo };
}
