export type Ilustracion = "contabilidad" | "legal" | "consultoria" | "impuestos" | "nomina" | "auditoria";

export interface Servicio {
  slug: string;
  title: string;
  summary: string;
  description: string;
  illustration: Ilustracion;
}
