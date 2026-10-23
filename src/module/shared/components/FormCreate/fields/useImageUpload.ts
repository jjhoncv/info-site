"use client";

import { useState } from "react";

const ERROR_GENERICO = "No se pudo subir la imagen; intenta de nuevo";

// Sube el archivo elegido a la API y avisa con la ruta pública. El servidor decide si es válido.
export function useImageUpload(api: string, onUploaded: (url: string) => void) {
  const [error, setError] = useState<string>();
  const [subiendo, setSubiendo] = useState(false);

  const subir = async (file: File) => {
    setError(undefined);
    setSubiendo(true);
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch(api, { method: "POST", body });
      const cuerpo = await res.json().catch(() => ({}));
      if (res.ok && cuerpo.data?.url) onUploaded(cuerpo.data.url);
      else setError(cuerpo.error ?? ERROR_GENERICO);
    } catch {
      setError(ERROR_GENERICO);
    } finally {
      setSubiendo(false);
    }
  };

  return { subir, error, subiendo };
}
