// Respuestas de la API del admin (convenciones §5): siempre { success, message|error, data }.
type Cuerpo = { success: boolean; message?: string; error?: string; data?: unknown };

export const createResponse = (cuerpo: Cuerpo, status = 200) => Response.json(cuerpo, { status });

// Valida el cuerpo JSON con el esquema zod (el mismo de la UI): devuelve los datos o la respuesta 400.
// Solo pasan los campos del esquema; el resto del cuerpo se descarta.
export async function parseBody<T>(
  req: Request,
  schema: { safeParse: (valor: unknown) => { success: true; data: T } | { success: false; error: { issues: { message: string }[] } } },
): Promise<{ data: T; response?: undefined } | { data?: undefined; response: Response }> {
  const cuerpo = await req.json().catch(() => undefined);
  const r = schema.safeParse(cuerpo);
  if (r.success) return { data: r.data };
  return { response: createResponse({ success: false, error: r.error.issues[0]?.message ?? "Datos no válidos" }, 400) };
}

// Un error inesperado: el detalle va al log y al cliente un mensaje genérico.
export function apiHandler<A extends unknown[]>(handler: (req: Request, ...args: A) => Promise<Response>) {
  return async (req: Request, ...args: A): Promise<Response> => {
    try {
      return await handler(req, ...args);
    } catch (error) {
      console.error("Error en la API del admin:", error);
      return createResponse({ success: false, error: "Ocurrió un error; intenta de nuevo" }, 500);
    }
  };
}
