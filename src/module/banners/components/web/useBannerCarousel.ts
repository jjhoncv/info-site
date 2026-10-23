"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

// El carrusel no cambia solo más rápido que esto (regla del ticket).
export const INTERVALO_MS = 6000;

// «Reducir movimiento» del sistema: se lee y se sigue con matchMedia (en el servidor, sin pedirlo).
const MENOS_MOVIMIENTO = "(prefers-reduced-motion: reduce)";
const pideMenosMovimiento = () => window.matchMedia?.(MENOS_MOVIMIENTO).matches ?? false;
const suscribirMovimiento = (avisar: () => void) => {
  const consulta = window.matchMedia?.(MENOS_MOVIMIENTO);
  consulta?.addEventListener("change", avisar);
  return () => consulta?.removeEventListener("change", avisar);
};

// Estado del carrusel: banner actual, cambio automático y sus pausas. No dibuja nada.
// El cambio automático se detiene si: el visitante pulsó «Pausar», tiene el mouse o el foco encima, o el
// sistema pide menos movimiento (`prefers-reduced-motion`).
export function useBannerCarousel(total: number) {
  const [actual, setActual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [encima, setEncima] = useState(false);
  const quieto = useSyncExternalStore(suscribirMovimiento, pideMenosMovimiento, () => false);

  // Depende de `actual`: al cambiar de banner (solo o a mano) el conteo de 6 segundos empieza de nuevo.
  useEffect(() => {
    if (total < 2 || pausado || encima || quieto) return;
    const reloj = setTimeout(() => setActual((a) => (a + 1) % total), INTERVALO_MS);
    return () => clearTimeout(reloj);
  }, [actual, total, pausado, encima, quieto]);

  const ir = (indice: number) => setActual(((indice % total) + total) % total);

  return {
    actual,
    quieto,
    pausado,
    ir,
    anterior: () => ir(actual - 1),
    siguiente: () => ir(actual + 1),
    alternarPausa: () => setPausado((p) => !p),
    enEncima: { onMouseEnter: () => setEncima(true), onMouseLeave: () => setEncima(false), onFocus: () => setEncima(true), onBlur: () => setEncima(false) },
  };
}
