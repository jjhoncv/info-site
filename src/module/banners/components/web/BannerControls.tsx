import type { Banner } from "../../services/types";

type Props = Readonly<{
  banners: Banner[];
  actual: number;
  pausado: boolean;
  puedePausar: boolean;
  onAnterior: () => void;
  onSiguiente: () => void;
  onPausa: () => void;
  onIr: (indice: number) => void;
}>;

const boton =
  "grid size-11 place-items-center rounded-full border border-white/35 bg-marca-900/40 text-white hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
const icono = { viewBox: "0 0 24 24", "aria-hidden": true, className: "size-[18px]" } as const;
const trazo = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

// «Anterior», «Siguiente», «Pausar», una barra por banner y «1 / 2». Todo con etiqueta y manejable con el teclado.
export function BannerControls({ banners, actual, pausado, puedePausar, onAnterior, onSiguiente, onPausa, onIr }: Props) {
  return (
    <div className="absolute inset-x-0 bottom-6">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 sm:px-6">
        <button type="button" className={boton} aria-label="Banner anterior" onClick={onAnterior}>
          <svg {...icono} {...trazo}><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <button type="button" className={boton} aria-label="Banner siguiente" onClick={onSiguiente}>
          <svg {...icono} {...trazo}><path d="M9 6l6 6-6 6" /></svg>
        </button>
        {puedePausar && (
          <button type="button" className={boton} aria-label={pausado ? "Reanudar los banners" : "Pausar los banners"} onClick={onPausa}>
            <svg {...icono} fill="currentColor">
              {pausado ? <path d="M8 5.5v13l11-6.5z" /> : <><rect x="7" y="6" width="3.5" height="12" rx="1" /><rect x="13.5" y="6" width="3.5" height="12" rx="1" /></>}
            </svg>
          </button>
        )}
        <div className="ms-2 flex gap-2">
          {banners.map((b, i) => (
            <button
              key={b.id}
              type="button"
              aria-label={`Ver banner ${i + 1}: ${b.title}`}
              aria-current={i === actual}
              onClick={() => onIr(i)}
              className={`h-1 w-8 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${i === actual ? "bg-acento-600" : "bg-white/35"}`}
            />
          ))}
        </div>
        <span aria-live="polite" className="ms-auto text-sm tabular-nums text-marca-100">
          {actual + 1} / {banners.length}
        </span>
      </div>
    </div>
  );
}
