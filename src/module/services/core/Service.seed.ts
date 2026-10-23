// Semilla de la demo: lo que «Restaurar demo» vuelve a cargar. Es la misma de
// db/migraciones/002-semilla-servicios.sql (Service.seed.test.ts vigila que no se separen).
// Las fotos viven en public/demo (docs/creditos.md).
export type ServiceSeed = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  includes: string[];
  imageUrl: string;
  imageAlt: string;
};

export const SERVICES_SEED: ServiceSeed[] = [
  {
    title: "Asesoría personalizada",
    slug: "asesoria-personalizada",
    summary: "Escuchamos tu caso y te proponemos la solución que de verdad necesitas.",
    description:
      "Antes de ofrecerte algo, entendemos cómo funciona tu negocio. Te explicamos las opciones en lenguaje simple, con costos y plazos claros, para que decidas con calma.",
    includes: ["Diagnóstico inicial sin costo", "Propuesta por escrito", "Un asesor asignado"],
    imageUrl: "/demo/servicios/asesoria-personalizada.jpg",
    imageAlt: "Dos asesores revisan una propuesta frente a una laptop",
  },
  {
    title: "Atención en tu local",
    slug: "atencion-en-tu-local",
    summary: "Vamos hasta donde estás, con el equipo y las herramientas necesarias.",
    description:
      "Coordinamos una visita en el horario que te acomode. Llegamos puntuales, trabajamos con orden y dejamos todo como lo encontramos.",
    includes: ["Visita en el día acordado", "Equipo identificado", "Informe al terminar"],
    imageUrl: "/demo/servicios/atencion-en-tu-local.jpg",
    imageAlt: "Técnicos con chaleco revisan un plano sobre la mesa",
  },
  {
    title: "Planes para empresas",
    slug: "planes-para-empresas",
    summary: "Precios fijos y atención prioritaria para clientes que trabajan con nosotros todo el año.",
    description:
      "Armamos un plan a la medida de tu volumen de trabajo, con una tarifa mensual que no cambia y un canal directo para tus pedidos.",
    includes: ["Tarifa mensual fija", "Atención prioritaria", "Reporte mensual"],
    imageUrl: "/demo/servicios/planes-para-empresas.jpg",
    imageAlt: "Equipo reunido conversando alrededor de una mesa",
  },
  {
    title: "Capacitación",
    slug: "capacitacion",
    summary: "Enseñamos a tu equipo a sacarle el máximo provecho, paso a paso.",
    description:
      "Talleres prácticos, presenciales o en línea, con material que tu equipo puede consultar después. Medimos lo aprendido al final de cada sesión.",
    includes: ["Talleres de 2 a 4 horas", "Material descargable", "Constancia de participación"],
    imageUrl: "/demo/servicios/capacitacion.jpg",
    imageAlt: "Un instructor explica un tema a un grupo de personas",
  },
  {
    title: "Soporte y mantenimiento",
    slug: "soporte-y-mantenimiento",
    summary: "Nos ocupamos de que todo siga funcionando, antes de que falle.",
    description:
      "Revisiones periódicas y una línea de soporte para resolver dudas e incidencias. Respondemos el mismo día hábil.",
    includes: ["Revisión programada", "Soporte por teléfono y WhatsApp", "Respuesta el mismo día hábil"],
    imageUrl: "/demo/servicios/soporte-y-mantenimiento.jpg",
    imageAlt: "Personas trabajando con varias laptops sobre una mesa",
  },
  {
    title: "Garantía y postventa",
    slug: "garantia-y-postventa",
    summary: "Respondemos por nuestro trabajo también después de entregarlo.",
    description:
      "Todo lo que hacemos tiene garantía por escrito. Si algo no queda como acordamos, lo resolvemos sin costo y sin vueltas.",
    includes: ["Garantía por escrito", "Seguimiento a los 30 días", "Atención de reclamos en 48 horas"],
    imageUrl: "/demo/servicios/garantia-y-postventa.jpg",
    imageAlt: "Dos personas se dan la mano sobre un escritorio",
  },
];
