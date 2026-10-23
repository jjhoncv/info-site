import type { Field } from "@/src/module/shared/components/FormCreate/types";

// Campos del formulario de servicios. Los largos máximos son los del esquema (Service.schema.ts).
export const servicesFields: Field[] = [
  // Información básica
  { key: "title", label: "Título", type: "text", section: "Información básica", required: true, maxLength: 150 },
  {
    key: "slug",
    label: "Dirección en el sitio",
    type: "text",
    section: "Información básica",
    required: true,
    maxLength: 150,
    slugFrom: "title",
    help: "Solo minúsculas, números y guiones. Se arma sola con el título.",
  },
  {
    key: "summary",
    label: "Resumen",
    type: "text",
    section: "Información básica",
    required: true,
    maxLength: 300,
    help: "Aparece en la tarjeta del servicio.",
  },
  { key: "description", label: "Descripción", type: "textarea", section: "Información básica", required: true, maxLength: 5000 },
  {
    key: "includes",
    label: "Qué incluye",
    type: "lines",
    section: "Información básica",
    help: "Una cosa por línea (hasta 10).",
  },
  // Imágenes: el campo de imagen llega con el ticket de subida de imágenes.
  // SEO
  { key: "metaTitle", label: "Título para buscadores", type: "text", section: "Buscadores", maxLength: 70 },
  { key: "metaDescription", label: "Descripción para buscadores", type: "textarea", section: "Buscadores", maxLength: 160 },
];
