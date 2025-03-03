import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (
    url.pathname.startsWith("/dashboard") ||
    url.pathname.startsWith("/settings") ||
    url.pathname.startsWith("/products/new") ||
    url.pathname.startsWith("/products/edit") ||
    url.pathname.startsWith("/chat")
  ) {
    if (!token) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  if (url.pathname.startsWith("/admin")) {
    if (token?.role !== "Admin") {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
