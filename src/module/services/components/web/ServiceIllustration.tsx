import type { ReactNode } from "react";
import type { Ilustracion } from "../../services/types";

// Ilustraciones propias: un marco común y un dibujo por servicio (registro, no switch).
const DIBUJOS: Record<Ilustracion, ReactNode> = {
  contabilidad: (
    <>
      <rect x="110" y="40" width="100" height="120" rx="10" fill="#fff" />
      <rect x="124" y="56" width="72" height="22" rx="4" fill="#dbe7ff" />
      {[0, 1, 2].map((fila) =>
        [0, 1, 2].map((col) => (
          <rect key={`${fila}${col}`} x={124 + col * 26} y={90 + fila * 22} width="20" height="14" rx="3" fill={col === 2 && fila === 2 ? "#14b88a" : "#1f4fd8"} />
        )),
      )}
    </>
  ),
  legal: (
    <>
      <rect x="146" y="40" width="8" height="100" rx="4" fill="#fff" />
      <rect x="100" y="48" width="120" height="8" rx="4" fill="#fff" />
      <path d="M84 100h52l-26 0zM84 100a26 14 0 0 0 52 0z" fill="#14b88a" />
      <path d="M184 100h52a26 14 0 0 1-52 0z" fill="#dbe7ff" />
      <rect x="126" y="140" width="68" height="10" rx="5" fill="#fff" />
    </>
  ),
  consultoria: (
    <>
      <circle cx="160" cy="100" r="52" fill="#fff" />
      <circle cx="160" cy="100" r="34" fill="#dbe7ff" />
      <circle cx="160" cy="100" r="16" fill="#1f4fd8" />
      <path d="M160 100l46-46" stroke="#14b88a" strokeWidth="8" strokeLinecap="round" />
    </>
  ),
  impuestos: (
    <>
      <rect x="116" y="38" width="88" height="124" rx="10" fill="#fff" />
      <path d="M134 78l52 52" stroke="#1f4fd8" strokeWidth="8" strokeLinecap="round" />
      <circle cx="138" cy="130" r="9" fill="#14b88a" />
      <circle cx="182" cy="78" r="9" fill="#14b88a" />
      <rect x="132" y="52" width="56" height="8" rx="4" fill="#dbe7ff" />
    </>
  ),
  nomina: (
    <>
      <circle cx="130" cy="82" r="20" fill="#fff" />
      <path d="M96 150a34 30 0 0 1 68 0z" fill="#fff" />
      <circle cx="196" cy="90" r="16" fill="#dbe7ff" />
      <path d="M170 150a26 24 0 0 1 52 0z" fill="#dbe7ff" />
      <circle cx="214" cy="60" r="14" fill="#14b88a" />
      <path d="M208 60h12M214 54v12" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  auditoria: (
    <>
      <rect x="100" y="44" width="92" height="116" rx="10" fill="#fff" />
      <rect x="116" y="62" width="60" height="8" rx="4" fill="#dbe7ff" />
      <rect x="116" y="82" width="44" height="8" rx="4" fill="#dbe7ff" />
      <circle cx="184" cy="112" r="28" fill="none" stroke="#1f4fd8" strokeWidth="9" />
      <path d="M204 132l22 22" stroke="#1f4fd8" strokeWidth="10" strokeLinecap="round" />
      <path d="M172 112l9 9 15-17" fill="none" stroke="#14b88a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

export function ServiceIllustration({ type, label }: Readonly<{ type: Ilustracion; label: string }>) {
  return (
    <svg viewBox="0 0 320 200" role="img" aria-label={label} className="block h-auto w-full">
      <rect width="320" height="200" fill="#1a3fb0" />
      <circle cx="40" cy="30" r="70" fill="#1f4fd8" opacity="0.6" />
      <circle cx="300" cy="190" r="80" fill="#0c1f4d" opacity="0.45" />
      {DIBUJOS[type]}
    </svg>
  );
}
