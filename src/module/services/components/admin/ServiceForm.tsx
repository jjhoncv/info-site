"use client";

import { FormCreate } from "@/src/module/shared/components/FormCreate/FormCreate";
import { toFormValues } from "@/src/module/shared/components/FormCreate/toPayload";
import { ServiceSchema } from "../../core/Service.schema";
import type { Service } from "@/src/types/domain";
import { servicesFields } from "./servicesFields";

// Crear (sin `service`) o editar (con `service`): la misma pantalla, el mismo esquema que la API.
// Vive aquí y no en la página porque un esquema zod no puede cruzar de servidor a cliente.
export function ServiceForm({ service }: Readonly<{ service?: Service }>) {
  return (
    <FormCreate
      api={service ? `/api/admin/services/${service.id}` : "/api/admin/services"}
      method={service ? "PATCH" : "POST"}
      fields={servicesFields}
      schema={ServiceSchema}
      redirect="/admin/services"
      initialValues={toFormValues(servicesFields, service)}
    />
  );
}
