import { z } from "zod";

// Esquema único: lo usan el formulario del admin y la API (convenciones §5). Los mensajes se ven en la UI.
const texto = (nombre: string, max: number, obligatorio: string) =>
  z
    .string({ error: obligatorio })
    .trim()
    .min(1, obligatorio)
    .max(max, `${nombre} admite hasta ${max} caracteres`);

const opcional = (nombre: string, max: number) =>
  z.string().trim().max(max, `${nombre} admite hasta ${max} caracteres`).optional();

export const ServiceSchema = z.object({
  title: texto("El título", 150, "El título es obligatorio"),
  slug: texto("El slug", 150, "El slug es obligatorio").regex(
    /^[a-z0-9]+(-[a-z0-9]+)*$/,
    "El slug solo admite minúsculas, números y guiones",
  ),
  summary: texto("El resumen", 300, "El resumen es obligatorio"),
  description: texto("La descripción", 5000, "La descripción es obligatoria"),
  includes: z.array(z.string().trim().min(1).max(200)).max(10),
  imageUrl: opcional("El enlace de la imagen", 500),
  imageAlt: opcional("El texto de la imagen", 200),
  metaTitle: opcional("El meta título", 70),
  metaDescription: opcional("La meta descripción", 160),
});

export type ServiceInput = z.infer<typeof ServiceSchema>;
