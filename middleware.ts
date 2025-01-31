import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyRequestSignature } from "@/lib/security";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/rewrite")) {
    let body: any;

    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid request format." },
        { status: 400 }
      );
    }

    const { text, style, timestamp } = body;
    const gaid = request.headers.get("x-gaid");

    if (!gaid || !text || !style || !timestamp) {
      return NextResponse.json(
        { success: false, message: "Missing required parameters." },
        { status: 400 }
      );
    }

    const isValid = await verifyRequestSignature({ text, style }, timestamp, gaid);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Error with Google Analytics ID." },
        { status: 400 }
      );
    }

    const newHeaders = new Headers(request.headers);
    newHeaders.set("x-verified-text", text);
    newHeaders.set("x-verified-style", style);

    return NextResponse.next({
      request: {
        headers: newHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};