import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

const allowedOrigins = [
  "http://localhost:3000",
  "https://www.vofatoki.work",
  "https://vo-portfolio-virid.vercel.app",
  "https://vo-portfolio-e7p3-nine.vercel.app",
  "https://admin.vofatoki.work",
  // Add your accepted URLs here
];

export async function proxy(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "";

  // 1. Handle preflight OPTIONS requests directly to bypass auth logic
  if (request.method === "OPTIONS") {
    const preflightHeaders = new Headers();
    if (allowedOrigins.includes(origin)) {
      preflightHeaders.set("Access-Control-Allow-Origin", origin);
      preflightHeaders.set("Access-Control-Allow-Credentials", "true");
      preflightHeaders.set(
        "Access-Control-Allow-Methods",
        "GET,DELETE,PATCH,POST,PUT,OPTIONS",
      );
      preflightHeaders.set(
        "Access-Control-Allow-Headers",
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
      );
    }
    return new NextResponse(null, { headers: preflightHeaders, status: 204 });
  }

  // 2. For standard requests, execute Supabase auth logic first
  const response = await updateSession(request);

  // 3. Apply CORS headers to the response
  if (allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET,DELETE,PATCH,POST,PUT,OPTIONS",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
