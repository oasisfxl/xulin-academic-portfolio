import {
  adminCookieNames,
  adminSessionMaxAge,
  createAdminSession,
} from "@/lib/admin-auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type GitHubTokenResponse = { access_token?: string; error?: string };
type GitHubUser = { login?: string };

function studioUrl(request: Request, path = "/studio") {
  return new URL(path, new URL(request.url).origin);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const store = await cookies();
  const expectedState = store.get(adminCookieNames.oauthStateCookie)?.value;

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(studioUrl(request, "/studio/login?error=state"));
  }

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret || !process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.redirect(studioUrl(request, "/studio/login?error=config"));
  }

  const callback = studioUrl(request, "/api/auth/github/callback").toString();
  let user: GitHubUser;
  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, redirect_uri: callback }),
      cache: "no-store",
    });
    const tokenData = (await tokenResponse.json()) as GitHubTokenResponse;
    if (!tokenData.access_token) {
      return NextResponse.redirect(studioUrl(request, "/studio/login?error=token"));
    }

    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${tokenData.access_token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    });
    if (!userResponse.ok) {
      return NextResponse.redirect(studioUrl(request, "/studio/login?error=identity"));
    }
    user = (await userResponse.json()) as GitHubUser;
  } catch {
    return NextResponse.redirect(studioUrl(request, "/studio/login?error=network"));
  }
  const allowedLogin = (process.env.GITHUB_ADMIN_LOGIN || "oasisfxl").toLowerCase();
  if (!user.login || user.login.toLowerCase() !== allowedLogin) {
    return NextResponse.redirect(studioUrl(request, "/studio/login?error=forbidden"));
  }

  const response = NextResponse.redirect(studioUrl(request));
  response.cookies.delete(adminCookieNames.oauthStateCookie);
  response.cookies.set(adminCookieNames.sessionCookie, createAdminSession(user.login), {
    httpOnly: true,
    maxAge: adminSessionMaxAge,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
