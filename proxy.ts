import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, hasAdminSession } from "@/src/module/auth/core/session";

// Quien entra a /admin sin sesión va a /login. La API se protege aparte, con withAdmin.
export async function proxy(request: NextRequest) {
  if (await hasAdminSession(request.cookies.get(COOKIE_NAME)?.value)) return NextResponse.next();
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = { matcher: ["/admin/:path*"] };
