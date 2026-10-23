import type { FieldErrors, Resolver } from "react-hook-form";
import { toPayload } from "./toPayload";
import type { Field, FormValues, PayloadSchema } from "./types";

// Une react-hook-form con el esquema zod del módulo: el mismo que valida la API, con los mismos mensajes.
// Va propio (y no @hookform/resolvers) porque ese paquete no resuelve sus peer deps con este árbol.
export function zodResolver(schema: PayloadSchema, fields: Field[]): Resolver<FormValues> {
  return async (values) => {
    const resultado = schema.safeParse(toPayload(fields, values));
    if (resultado.success) return { values, errors: {} };
    const errors: FieldErrors<FormValues> = {};
    for (const { path, message, code } of resultado.error.issues) {
      const key = String(path[0]);
      if (!(key in errors)) errors[key] = { type: code, message };
    }
    return { values: {}, errors };
  };
}
