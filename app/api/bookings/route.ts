import { createBooking } from "@/lib/bookings";
import { isDatabaseConfigured } from "@/lib/db";
import { json, MIN_HUMAN_MS, notConfigured, readJsonBody } from "@/lib/http";
import { notifyNewBooking } from "@/lib/notifications";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { bookingSchema, fieldErrors } from "@/lib/validation/booking";

export async function POST(req: Request) {
  if (!isDatabaseConfigured) return notConfigured("enquiries");
  const limited = rateLimit(clientKey(req.headers, "booking"), 5, 10 * 60 * 1000);
  if (!limited.ok) {
    return json(
      { error: "You've sent several requests in a short time. Please wait a few minutes and try again." },
      429,
      { "Retry-After": String(limited.retryAfter) },
    );
  }

  const read = await readJsonBody(req);
  if ("error" in read) return read.error;

  const parsed = bookingSchema.safeParse(read.body);
  if (!parsed.success) {
    const errors = fieldErrors(parsed.error);
    // Honeypot or impossible timing: respond as if accepted, store nothing.
    if (errors.company) return json({ status: "received", reference: null }, 202);
    return json({ error: "Please check the highlighted fields.", fieldErrors: errors }, 422);
  }
  const data = parsed.data;
  if (data.elapsedMs !== undefined && data.elapsedMs < MIN_HUMAN_MS) {
    return json({ status: "received", reference: null }, 202);
  }

  try {
    const result = await createBooking(data);
    if (result.kind === "duplicate") {
      return json(
        {
          error: `We already have an open enquiry from this email address for this service (reference ${result.reference}). You'll be contacted about it soon — there's no need to submit again.`,
          code: "duplicate",
          reference: result.reference,
        },
        409,
      );
    }
    if (result.kind === "created") {
      // Never block the visitor on email delivery.
      void notifyNewBooking(result.booking);
    }
    return json(
      {
        status: "received",
        reference: result.booking.reference,
        replayed: result.kind === "replayed",
      },
      result.kind === "created" ? 201 : 200,
    );
  } catch {
    console.error("[bookings] failed to store enquiry");
    return json({ error: "We couldn't save your request just now. Please try again in a moment." }, 500);
  }
}
