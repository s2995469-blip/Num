import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, lt } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db, schema } from "../db";

const COOKIE = "ph_admin_session";
const SESSION_DAYS = 7;

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 864e5);
  await db.insert(schema.adminSessions).values({ id: hashToken(token), userId, expiresAt });
  // Clear expired sessions while we're here.
  await db.delete(schema.adminSessions).where(lt(schema.adminSessions.expiresAt, new Date()));

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/** Returns the signed-in admin or null. Memoised per request. */
export const getAdmin = cache(async () => {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const rows = await db
    .select({ id: schema.adminUsers.id, email: schema.adminUsers.email })
    .from(schema.adminSessions)
    .innerJoin(schema.adminUsers, eq(schema.adminUsers.id, schema.adminSessions.userId))
    .where(and(eq(schema.adminSessions.id, hashToken(token)), gt(schema.adminSessions.expiresAt, new Date())))
    .limit(1);
  return rows[0] ?? null;
});

/** Server-side authorization gate for admin pages and actions. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await db.delete(schema.adminSessions).where(eq(schema.adminSessions.id, hashToken(token)));
  jar.delete(COOKIE);
}
