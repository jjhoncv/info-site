"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toPayload } from "./toPayload";
import type { Field, FormValues, PayloadSchema } from "./types";
import { zodResolver } from "./zodResolver";

export type FormCreateConfig = {
  api: string;
  method: "POST" | "PATCH";
  fields: Field[];
  schema: PayloadSchema;
  redirect: string;
  initialValues: FormValues;
};

const ERROR_GENERICO = "No se pudo guardar; intenta de nuevo";

// useForm + enviar a la API + aviso + redirigir. No dibuja nada.
export function useFormCreate({ api, method, fields, schema, redirect, initialValues }: FormCreateConfig) {
  const router = useRouter();
  const [aviso, setAviso] = useState<string>();
  const form = useForm<FormValues>({ defaultValues: initialValues, resolver: zodResolver(schema, fields) });

  const valores = useWatch({ control: form.control });

  const guardar = form.handleSubmit(async (values) => {
    setAviso(undefined);
    try {
      const res = await fetch(api, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(fields, values)),
      });
      if (!res.ok) return setAviso((await res.json().catch(() => ({}))).error ?? ERROR_GENERICO);
    } catch {
      return setAviso(ERROR_GENERICO);
    }
    router.push(redirect);
    router.refresh();
  });

  return { form, valores, guardar, aviso, enviando: form.formState.isSubmitting };
}
