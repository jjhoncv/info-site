"use client";

import { useImageUpload } from "../files/useImageUpload";
import type { Field } from "../types";

type Props = { field: Field; value: string; onChange: (url: string) => void };

// Zona para elegir la imagen (maqueta admin.html → Formulario de servicio), vista previa y aviso del servidor.
export function ImageField({ field, value, onChange }: Readonly<Props>) {
  const { subir, error, subiendo } = useImageUpload(onChange);
  const { key, label, help } = field;
  const ayuda = `${key}-ayuda`;
  return (
    <div className="flex flex-col gap-3">
      <label
        htmlFor={key}
        className="flex cursor-pointer flex-col items-center gap-1 rounded-tarjeta border-2 border-dashed border-linea bg-[#fbfcfd] p-6 text-center text-tinta-suave hover:border-marca-600 hover:bg-marca-50"
      >
        <b className="text-marca-900">{label}</b>
        <span>Arrastra una imagen o haz clic para elegirla</span>
        <span className="text-sm">JPG, PNG o WebP · máximo 2 MB</span>
        <input
          id={key}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          aria-describedby={ayuda}
          onChange={(e) => {
            const archivo = e.target.files?.[0];
            if (archivo) void subir(archivo);
            e.target.value = "";
          }}
        />
      </label>
      <p id={ayuda} className="text-sm text-tinta-suave">
        {subiendo ? "Subiendo imagen…" : help}
      </p>
      {error && (
        <p role="alert" className="text-sm font-semibold text-error">
          {error}
        </p>
      )}
      {value && (
        // eslint-disable-next-line @next/next/no-img-element -- vista previa de una imagen subida (images.unoptimized)
        <img src={value} alt="Vista previa de la imagen del servicio" className="max-h-48 w-fit rounded-tarjeta" />
      )}
    </div>
  );
}
