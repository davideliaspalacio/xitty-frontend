import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = ["/dashboard", "/admin", "/profile", "/reservations", "/favorites"];

export function proxy(req: NextRequest) {
  const isProtected = PROTECTED.some((p) => req.nextUrl.pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // Auth state lives in localStorage (Zustand persist) — no SSR cookie yet.
  // The AuthGate component handles client-side redirects. This proxy is a
  // placeholder for future SSR-aware auth via cookies.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
