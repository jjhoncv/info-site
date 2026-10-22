import { EMPRESA } from "./empresa";

// Espacio para la marca del cliente: un monograma y el nombre. En la Fase 3 se reemplaza por su logo.
export function Logo({ claro = false }: Readonly<{ claro?: boolean }>) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className={`grid size-9 place-items-center rounded-tarjeta font-titulo text-base font-bold ${
          claro ? "bg-white text-marca-900" : "bg-marca-900 text-white"
        }`}
      >
        TE
      </span>
      <span className={`font-titulo text-xl font-bold ${claro ? "text-white" : "text-marca-900"}`}>{EMPRESA.nombre}</span>
    </span>
  );
}
