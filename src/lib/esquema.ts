import type { z } from "zod";

/**
 * Toma de `objeto` solo los campos que define el esquema zod (sus claves), sin nombrarlos a mano.
 * Para editar (PATCH): lo actual + lo que llega. Así un campo nuevo del esquema no se borra al editar.
 */
export function soloCamposDelEsquema<S extends z.ZodObject>(esquema: S, objeto: object): Partial<z.input<S>> {
  const campos = Object.keys(esquema.shape);
  return Object.fromEntries(Object.entries(objeto).filter(([clave]) => campos.includes(clave))) as Partial<z.input<S>>;
}
