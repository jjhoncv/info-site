// Respuestas de la API del admin (convenciones §5): siempre { success, message|error, data }.
type Cuerpo = { success: boolean; message?: string; error?: string; data?: unknown };

export const createResponse = (cuerpo: Cuerpo, status = 200) => Response.json(cuerpo, { status });

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
