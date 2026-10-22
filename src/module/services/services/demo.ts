import type { Servicio } from "./types";

// Datos inventados del boceto (T1), pensados para que calcen en cualquier negocio (ADR 0008).
// El módulo con MySQL (T2) reemplaza este archivo. Fotos CC0 de StockSnap (docs/creditos.md).
const SERVICIOS: Servicio[] = [
  {
    slug: "asesoria-personalizada",
    title: "Asesoría personalizada",
    summary: "Escuchamos tu caso y te proponemos la solución que de verdad necesitas.",
    description:
      "Antes de ofrecerte algo, entendemos cómo funciona tu negocio. Te explicamos las opciones en lenguaje simple, con costos y plazos claros, para que decidas con calma.",
    includes: ["Diagnóstico inicial sin costo", "Propuesta por escrito", "Un asesor asignado"],
    image: "/demo/servicios/asesoria-personalizada.jpg",
    imageAlt: "Dos asesores revisan una propuesta frente a una laptop",
  },
  {
    slug: "atencion-en-tu-local",
    title: "Atención en tu local",
    summary: "Vamos hasta donde estás, con el equipo y las herramientas necesarias.",
    description:
      "Coordinamos una visita en el horario que te acomode. Llegamos puntuales, trabajamos con orden y dejamos todo como lo encontramos.",
    includes: ["Visita en el día acordado", "Equipo identificado", "Informe al terminar"],
    image: "/demo/servicios/atencion-en-tu-local.jpg",
    imageAlt: "Técnicos con chaleco revisan un plano sobre la mesa",
  },
  {
    slug: "planes-para-empresas",
    title: "Planes para empresas",
    summary: "Precios fijos y atención prioritaria para clientes que trabajan con nosotros todo el año.",
    description:
      "Armamos un plan a la medida de tu volumen de trabajo, con una tarifa mensual que no cambia y un canal directo para tus pedidos.",
    includes: ["Tarifa mensual fija", "Atención prioritaria", "Reporte mensual"],
    image: "/demo/servicios/planes-para-empresas.jpg",
    imageAlt: "Equipo reunido conversando alrededor de una mesa",
  },
  {
    slug: "capacitacion",
    title: "Capacitación",
    summary: "Enseñamos a tu equipo a sacarle el máximo provecho, paso a paso.",
    description:
      "Talleres prácticos, presenciales o en línea, con material que tu equipo puede consultar después. Medimos lo aprendido al final de cada sesión.",
    includes: ["Talleres de 2 a 4 horas", "Material descargable", "Constancia de participación"],
    image: "/demo/servicios/capacitacion.jpg",
    imageAlt: "Un instructor explica un tema a un grupo de personas",
  },
  {
    slug: "soporte-y-mantenimiento",
    title: "Soporte y mantenimiento",
    summary: "Nos ocupamos de que todo siga funcionando, antes de que falle.",
    description:
      "Revisiones periódicas y una línea de soporte para resolver dudas e incidencias. Respondemos el mismo día hábil.",
    includes: ["Revisión programada", "Soporte por teléfono y WhatsApp", "Respuesta el mismo día hábil"],
    image: "/demo/servicios/soporte-y-mantenimiento.jpg",
    imageAlt: "Personas trabajando con varias laptops sobre una mesa",
  },
  {
    slug: "garantia-y-postventa",
    title: "Garantía y postventa",
    summary: "Respondemos por nuestro trabajo también después de entregarlo.",
    description:
      "Todo lo que hacemos tiene garantía por escrito. Si algo no queda como acordamos, lo resolvemos sin costo y sin vueltas.",
    includes: ["Garantía por escrito", "Seguimiento a los 30 días", "Atención de reclamos en 48 horas"],
    image: "/demo/servicios/garantia-y-postventa.jpg",
    imageAlt: "Dos personas se dan la mano sobre un escritorio",
  },
];

export function getServicios(): Servicio[] {
  return SERVICIOS;
}

export function getServicioBySlug(slug: string): Servicio | undefined {
  return SERVICIOS.find((s) => s.slug === slug);
}
