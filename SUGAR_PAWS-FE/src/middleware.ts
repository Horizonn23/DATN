import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Check if this is an admin route RSC request
  if (pathname.startsWith("/admin") && search.includes("_rsc=")) {
    // Return early to avoid unnecessary processing
    // This helps reduce server-side overhead
    const response = NextResponse.next();

    // Add headers to prevent caching of RSC payloads
    response.headers.set("Cache-Control", "no-store, must-revalidate");
    response.headers.set("CDN-Cache-Control", "no-store");
    response.headers.set("Vercel-CDN-Cache-Control", "no-store");

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
