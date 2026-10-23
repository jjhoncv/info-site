import { describe, expect, it } from "vitest";
import { toFormValues, toPayload } from "../toPayload";
import type { Field, PayloadSchema } from "../types";
import { zodResolver } from "../zodResolver";

const fields: Field[] = [
  { key: "title", label: "Título", type: "text", section: "A" },
  { key: "includes", label: "Incluye", type: "lines", section: "A" },
];

describe("toPayload", () => {
  it("pasa el texto tal cual y convierte «lines» en lista sin líneas vacías", () => {
    expect(toPayload(fields, { title: "T", includes: " Uno \n\nDos\n" })).toEqual({ title: "T", includes: ["Uno", "Dos"] });
  });

  it("un campo que falta es texto vacío", () => {
    expect(toPayload(fields, {})).toEqual({ title: "", includes: [] });
  });
});

describe("toFormValues", () => {
  it("convierte el registro en texto (lista → una por línea, null → vacío)", () => {
    expect(toFormValues(fields, { title: "T", includes: ["Uno", "Dos"], otro: 1 })).toEqual({ title: "T", includes: "Uno\nDos" });
    expect(toFormValues(fields, { title: undefined })).toEqual({ title: "", includes: "" });
    expect(toFormValues(fields)).toEqual({ title: "", includes: "" });
  });
});

describe("zodResolver", () => {
  const schema: PayloadSchema = {
    safeParse: (v) => {
      const { title } = v as { title: string };
      return title
        ? { success: true, data: v }
        : { success: false, error: { issues: [{ path: ["title"], message: "El título es obligatorio", code: "too_small" }] } };
    },
  };
  const resolver = zodResolver(schema, fields);
  const llamar = (values: Record<string, string>) => resolver(values, undefined, {} as never);

  it("sin errores devuelve los valores", async () => {
    expect(await llamar({ title: "T", includes: "" })).toEqual({ values: { title: "T", includes: "" }, errors: {} });
  });

  it("con errores los pone bajo el campo con el mensaje del esquema", async () => {
    const r = await llamar({ title: "", includes: "" });
    expect(r.errors.title?.message).toBe("El título es obligatorio");
  });
});
