import { EMPRESA } from "./empresa";

// Isotipo genérico (tres barras que crecen: sirve para cualquier rubro) + nombre. En la Fase 3 el cliente
// sube su logo desde el admin y reemplaza esta marca.
export function LogoMark({ claro = false, className = "size-9" }: Readonly<{ claro?: boolean; className?: string }>) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="9" className={claro ? "fill-white" : "fill-marca-900"} />
      <rect x="9" y="21" width="5.5" height="10" rx="1.5" className={claro ? "fill-marca-900" : "fill-white"} />
      <rect x="17.25" y="15" width="5.5" height="16" rx="1.5" className={claro ? "fill-marca-900" : "fill-white"} />
      <rect x="25.5" y="9" width="5.5" height="22" rx="1.5" className="fill-acento-600" />
    </svg>
  );
}

export function Logo({ claro = false }: Readonly<{ claro?: boolean }>) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark claro={claro} />
      <span className="flex flex-col leading-none">
        <span className={`font-titulo text-xl font-bold ${claro ? "text-white" : "text-marca-900"}`}>{EMPRESA.nombre}</span>
        <span className={`mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] ${claro ? "text-marca-100" : "text-tinta-suave"}`}>
          {EMPRESA.rubro}
        </span>
      </span>
    </span>
  );
}
