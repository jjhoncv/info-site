import { COOKIE_NAME, readSession } from "./session";

type Handler<A extends unknown[]> = (req: Request, ...args: A) => Promise<Response>;

const leerCookie = (req: Request) =>
  req.headers
    .get("cookie")
    ?.split(/;\s*/)
    .find((c) => c.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);

// Protege /api/admin/* en el servidor: 401 sin sesión, 403 con sesión que no es de admin.
export function withAdmin<A extends unknown[]>(handler: Handler<A>): Handler<A> {
  return async (req, ...args) => {
    const cookie = leerCookie(req);
    const session = await readSession(cookie);
    if (session.isAdmin === true) return handler(req, ...args);
    const sinSesion = Object.keys(session).length === 0;
    return Response.json(
      { success: false, error: sinSesion ? "No autenticado" : "Sin permiso" },
      { status: sinSesion ? 401 : 403 },
    );
  };
}
