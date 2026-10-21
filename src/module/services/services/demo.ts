import type { Servicio } from "./types";

// Datos inventados del boceto (T1). El módulo con MySQL (T2) reemplaza este archivo.
const SERVICIOS: Servicio[] = [
  {
    slug: "asesoria-contable",
    title: "Asesoría contable",
    summary: "Libros al día y números claros para decidir con calma.",
    description:
      "Llevamos la contabilidad de tu empresa de forma ordenada: registro mensual, balances y reportes que se entienden sin ser contador. Te acompañamos para que cada decisión tenga un número que la respalde.",
    illustration: "contabilidad",
  },
  {
    slug: "asesoria-legal",
    title: "Asesoría legal",
    summary: "Contratos y trámites sin sorpresas.",
    description:
      "Revisamos y redactamos contratos, constituimos sociedades y resolvemos trámites ante entidades públicas. Prevenir cuesta menos que litigar, y lo hacemos con lenguaje simple.",
    illustration: "legal",
  },
  {
    slug: "consultoria-de-gestion",
    title: "Consultoría de gestión",
    summary: "Procesos más simples para equipos que crecen.",
    description:
      "Analizamos cómo trabaja tu empresa, detectamos cuellos de botella y definimos un plan de mejora con metas medibles. Trabajamos junto a tu equipo hasta que el cambio se sostiene solo.",
    illustration: "consultoria",
  },
  {
    slug: "planificacion-tributaria",
    title: "Planificación tributaria",
    summary: "Cumple a tiempo y paga solo lo justo.",
    description:
      "Preparamos tus declaraciones, calendarizamos vencimientos y buscamos la mejor estructura dentro de la ley. Sin multas, sin urgencias de último día.",
    illustration: "impuestos",
  },
  {
    slug: "planillas-y-nomina",
    title: "Planillas y nómina",
    summary: "Pagos puntuales y boletas en regla.",
    description:
      "Calculamos sueldos, beneficios y aportes, y emitimos las boletas de tu equipo cada mes. Tus colaboradores cobran a tiempo y tú duermes tranquilo.",
    illustration: "nomina",
  },
  {
    slug: "auditoria-interna",
    title: "Auditoría interna",
    summary: "Una mirada externa antes de que lo haga alguien más.",
    description:
      "Revisamos controles, inventarios y registros para encontrar riesgos a tiempo. Entregamos un informe claro con prioridades y pasos concretos para corregir.",
    illustration: "auditoria",
  },
];

export function getServicios(): Servicio[] {
  return SERVICIOS;
}

export function getServicioBySlug(slug: string): Servicio | undefined {
  return SERVICIOS.find((s) => s.slug === slug);
}
