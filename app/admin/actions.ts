"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession, requireAdmin } from "@/lib/auth/session";
import { db, isDatabaseConfigured, schema } from "@/lib/db";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export type LoginState = { error?: string; email?: string };

// A real hash of a random string, so unknown emails cost the same time as known ones.
const DUMMY_HASH =
  "scrypt$32768$8$1$E8fowHeYYy53pmAQLgaynA==$QWR9TO/PNlQk35F6qnVRJ48cp+clekjbxgQuuDMEW5JOc3NYY+lhGZGojvt/jPTHvBn5ult7qTa/mCqA/fwJ0Q==";

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password || email.length > 254 || password.length > 512) {
    return { error: "Please enter your email and password.", email };
  }

  if (!isDatabaseConfigured) {
    return { error: "The admin area isn't set up yet: no database is configured (see README).", email };
  }

  const h = await headers();
  const ipLimit = rateLimit(clientKey(h, "login-ip"), 10, 15 * 60 * 1000);
  const acctLimit = rateLimit(`login-acct:${email}`, 5, 15 * 60 * 1000);
  if (!ipLimit.ok || !acctLimit.ok) {
    return { error: "Too many sign-in attempts. Please wait 15 minutes and try again.", email };
  }

  const [user] = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.email, email)).limit(1);
  const ok = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !ok) return { error: "That email and password combination wasn't recognised.", email };

  await createSession(user.id);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

const statusSchema = z.enum(schema.bookingStatus.enumValues);

export async function updateBooking(formData: FormData) {
  await requireAdmin();
  const id = z.uuid().parse(formData.get("id"));
  const status = statusSchema.parse(formData.get("status"));
  const notes = z.string().max(4000).parse(String(formData.get("adminNotes") ?? "")).trim();

  const [current] = await db
    .select({ confirmedAt: schema.bookings.confirmedAt })
    .from(schema.bookings)
    .where(eq(schema.bookings.id, id))
    .limit(1);
  if (!current) redirect("/admin");

  await db
    .update(schema.bookings)
    .set({
      status,
      adminNotes: notes || null,
      updatedAt: new Date(),
      confirmedAt: status === "confirmed" ? (current.confirmedAt ?? new Date()) : current.confirmedAt,
    })
    .where(eq(schema.bookings.id, id));

  revalidatePath("/admin");
  redirect(`/admin/enquiries/${id}?saved=1`);
}

export async function updateMessageStatus(formData: FormData) {
  await requireAdmin();
  const id = z.uuid().parse(formData.get("id"));
  const status = z.enum(schema.contactStatus.enumValues).parse(formData.get("status"));
  await db.update(schema.contactMessages).set({ status }).where(eq(schema.contactMessages.id, id));
  revalidatePath("/admin/messages");
}
