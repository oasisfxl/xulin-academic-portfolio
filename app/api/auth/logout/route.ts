import { adminCookieNames } from "@/lib/admin-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.delete(adminCookieNames.sessionCookie);
  response.cookies.delete(adminCookieNames.oauthStateCookie);
  return response;
}
