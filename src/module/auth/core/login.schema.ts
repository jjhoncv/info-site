import { z } from "zod";

// Mismo esquema en el formulario y en la acción del servidor.
export const loginSchema = z.object({
  username: z.string().trim().min(1, "El usuario es obligatorio").max(100),
  password: z.string().min(1, "La clave es obligatoria").max(200),
});

export type LoginInput = z.infer<typeof loginSchema>;
