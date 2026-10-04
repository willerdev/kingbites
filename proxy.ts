import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "kb_session";

export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();
  const url = new URL("/login", request.url);
  url.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/account/:path*", "/checkout", "/track/:path*", "/admin/:path*", "/driver/:path*"],
};
