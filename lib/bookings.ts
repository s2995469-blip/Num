import "server-only";
import { and, eq, gt, inArray } from "drizzle-orm";
import { db, schema } from "./db";
import type { Booking } from "./db/schema";
import { makeReference } from "./reference";
import type { BookingData } from "./validation/booking";


export type CreateBookingResult =
  | { kind: "created"; booking: Booking }
  | { kind: "replayed"; booking: Booking }
  | { kind: "duplicate"; reference: string };

const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000;

export async function createBooking(data: BookingData): Promise<CreateBookingResult> {
  // 1. Same submission retried (double-click, network retry): return the original.
  const [replay] = await db
    .select()
    .from(schema.bookings)
    .where(eq(schema.bookings.idempotencyKey, data.idempotencyKey))
    .limit(1);
  if (replay) return { kind: "replayed", booking: replay };

  // 2. A separate, still-open enquiry for the same service from the same email.
  const [open] = await db
    .select({ reference: schema.bookings.reference })
    .from(schema.bookings)
    .where(
      and(
        eq(schema.bookings.email, data.email),
        eq(schema.bookings.service, data.service),
        inArray(schema.bookings.status, ["new", "contacted"]),
        gt(schema.bookings.createdAt, new Date(Date.now() - DUPLICATE_WINDOW_MS)),
      ),
    )
    .limit(1);
  if (open) return { kind: "duplicate", reference: open.reference };

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const [booking] = await db
        .insert(schema.bookings)
        .values({
          reference: makeReference(),
          name: data.name,
          email: data.email,
          phone: data.phone,
          service: data.service,
          preferredDate: data.preferredDate,
          preferredTime: data.preferredTime,
          sessionFormat: data.sessionFormat || null,
          message: data.message,
          privacyConsent: data.privacyConsent,
          idempotencyKey: data.idempotencyKey,
        })
        .returning();
      return { kind: "created", booking };
    } catch (err) {
      const e = err as { code?: string; constraint?: string; cause?: { code?: string; constraint?: string } };
      const code = e.code ?? e.cause?.code;
      const constraint = e.constraint ?? e.cause?.constraint ?? "";
      if (code !== "23505") throw err;
      // Concurrent replay of the same submission.
      if (constraint.includes("idempotency")) {
        const [row] = await db
          .select()
          .from(schema.bookings)
          .where(eq(schema.bookings.idempotencyKey, data.idempotencyKey))
          .limit(1);
        if (row) return { kind: "replayed", booking: row };
      }
      // Otherwise a reference collision — retry with a new one.
    }
  }
  throw new Error("Could not allocate a booking reference");
}
