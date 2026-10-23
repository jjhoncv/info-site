// Formulario configurable del admin (convenciones §4): cada módulo declara sus campos y su esquema zod.
export type FieldType = "text" | "textarea" | "lines";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  // Título de la sección donde se dibuja (los campos con el mismo `section` van juntos).
  section: string;
  required?: boolean;
  maxLength?: number;
  help?: string;
  placeholder?: string;
  // Solo en «crear»: mientras no se edite este campo, se llena con el texto de otro (p. ej. slug ← título).
  slugFrom?: string;
};

// Todo lo que escribe la persona es texto; `toPayload` lo convierte a lo que espera el esquema.
export type FormValues = Record<string, string>;

export type SchemaResult =
  | { success: true; data: unknown }
  | { success: false; error: { issues: { path: PropertyKey[]; message: string; code: string }[] } };

// Lo único que necesita FormCreate de un esquema zod: validar y devolver los mensajes.
export type PayloadSchema = { safeParse: (valor: unknown) => SchemaResult };
