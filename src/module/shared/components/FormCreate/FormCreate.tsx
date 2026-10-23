"use client";

import { Button, ButtonLink } from "@/src/components/Button";
import { FieldRenderer } from "./fields/FieldRenderer";
import { ImageField } from "./fields/ImageField";
import type { Field, FormValues, PayloadSchema } from "./types";
import { useFormCreate } from "./useFormCreate";

type Props = {
  api: string;
  method?: "POST" | "PATCH";
  fields: Field[];
  schema: PayloadSchema;
  redirect: string;
  initialValues: FormValues;
};

// Agrupa los campos por sección, respetando el orden en que se declararon.
const porSeccion = (fields: Field[]) =>
  [...new Set(fields.map((f) => f.section))].map((titulo) => ({ titulo, campos: fields.filter((f) => f.section === titulo) }));

// Une las piezas: <FormCreate api fields schema redirect /> (convenciones §7b).
export function FormCreate({ method = "POST", ...config }: Readonly<Props>) {
  const { form, valores, guardar, aviso, enviando } = useFormCreate({ method, ...config });
  const { register, formState } = form;
  return (
    <form onSubmit={guardar} noValidate className="flex flex-col gap-5">
      {porSeccion(config.fields).map(({ titulo, campos }) => (
        <section key={titulo} className="flex flex-col gap-5 rounded-tarjeta bg-white p-5">
          <h2 className="text-xl font-bold text-marca-900">{titulo}</h2>
          {campos.map((field) =>
            field.type === "image" ? (
              <ImageField
                key={field.key}
                field={field}
                value={valores[field.key] ?? ""}
                onChange={(url) => form.setValue(field.key, url, { shouldDirty: true })}
              />
            ) : (
              <FieldRenderer
                key={field.key}
                field={field}
                register={register(field.key)}
                error={formState.errors[field.key]}
                length={valores[field.key]?.length ?? 0}
              />
            ),
          )}
        </section>
      ))}
      <div className="sticky bottom-0 flex flex-wrap items-center justify-end gap-3 border-t border-linea bg-[#f4f6f9]/95 py-3 backdrop-blur-sm">
        {aviso && (
          <p role="alert" className="mr-auto font-semibold text-error">
            {aviso}
          </p>
        )}
        <ButtonLink href={config.redirect} variant="secundario">
          Cancelar
        </ButtonLink>
        <Button type="submit" disabled={enviando}>
          {enviando ? "Guardando…" : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}
