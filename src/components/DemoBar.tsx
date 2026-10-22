import { EMPRESA } from "./empresa";

// Franja superior: deja claro que es una demo y muestra el contacto (confianza) en una sola línea.
export function DemoBar() {
  return (
    <div className="bg-marca-900 text-xs text-marca-100">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-2 sm:px-6">
        <p>
          <span className="font-semibold text-white">Sitio de demostración:</span> tu logo, tus colores y tus textos van
          aquí.
        </p>
        <p className="hidden sm:block">
          {EMPRESA.horario} · {EMPRESA.telefono}
        </p>
      </div>
    </div>
  );
}
