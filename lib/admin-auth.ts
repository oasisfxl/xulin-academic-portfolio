import { cookies } from "next/headers";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const sessionCookie = "xulin_studio_session";
const oauthStateCookie = "xulin_oauth_state";
const sessionLifetime = 60 * 60 * 24 * 14;

type AdminSession = {
  login: string;
  exp: number;
};

function secret() {
  return process.env.ADMIN_SESSION_SECRET ?? "";
}

function signature(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createAdminSession(login: string) {
  const payload = Buffer.from(
    JSON.stringify({ login, exp: Math.floor(Date.now() / 1000) + sessionLifetime })
  ).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function verifyAdminSession(value?: string): AdminSession | null {
  if (!value || !secret()) return null;
  const [payload, suppliedSignature] = value.split(".");
  if (!payload || !suppliedSignature) return null;
  const expectedSignature = signature(payload);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return null;
  }

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as AdminSession;
    const allowedLogin = (process.env.GITHUB_ADMIN_LOGIN || "oasisfxl").toLowerCase();
    if (
      session.login.toLowerCase() !== allowedLogin ||
      session.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  if (process.env.NODE_ENV !== "production") {
    return { login: process.env.GITHUB_ADMIN_LOGIN || "oasisfxl", exp: Infinity };
  }
  const store = await cookies();
  return verifyAdminSession(store.get(sessionCookie)?.value);
}

export async function isAdminRequest() {
  return Boolean(await getAdminSession());
}

export function newOAuthState() {
  return randomBytes(32).toString("base64url");
}

export const adminCookieNames = { sessionCookie, oauthStateCookie };
export const adminSessionMaxAge = sessionLifetime;
