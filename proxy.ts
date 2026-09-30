import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Route guard and request pipeline.
 *
 * Today this is a no-op pass-through — no auth is wired yet. When auth lands,
 * plug it in here following the same pattern as pos-frontend's proxy.ts:
 * resolve the session, guard protected routes, forward the access token.
 */
export default function proxy(_req: NextRequest) {
  void _req;
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
