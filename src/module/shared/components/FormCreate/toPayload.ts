import type { Field, FormValues } from "./types";

// Texto del formulario → cuerpo de la API. Un campo «lines» (un elemento por línea) pasa a lista.
export function toPayload(fields: Field[], values: FormValues): Record<string, unknown> {
  return Object.fromEntries(
    fields.map(({ key, type }) => {
      const valor = values[key] ?? "";
      return [key, type === "lines" ? valor.split("\n").map((l) => l.trim()).filter(Boolean) : valor];
    }),
  );
}

// Registro guardado → texto del formulario (lo contrario de toPayload).
export function toFormValues(fields: Field[], registro: object = {}): FormValues {
  return Object.fromEntries(
    fields.map(({ key }) => {
      const valor = (registro as Record<string, unknown>)[key];
      return [key, Array.isArray(valor) ? valor.join("\n") : String(valor ?? "")];
    }),
  );
}
