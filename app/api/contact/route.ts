import { eq } from "drizzle-orm";
import { db, isDatabaseConfigured, schema } from "@/lib/db";
import { json, MIN_HUMAN_MS, notConfigured, readJsonBody } from "@/lib/http";
import { notifyNewContact } from "@/lib/notifications";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { contactSchema, fieldErrors } from "@/lib/validation/booking";

export async function POST(req: Request) {
  if (!isDatabaseConfigured) return notConfigured("messages");
  const limited = rateLimit(clientKey(req.headers, "contact"), 5, 10 * 60 * 1000);
  if (!limited.ok) {
    return json({ error: "Too many messages in a short time. Please try again shortly." }, 429, {
      "Retry-After": String(limited.retryAfter),
    });
  }

  const read = await readJsonBody(req);
  if ("error" in read) return read.error;

  const parsed = contactSchema.safeParse(read.body);
  if (!parsed.success) {
    const errors = fieldErrors(parsed.error);
    if (errors.company) return json({ status: "received" }, 202);
    return json({ error: "Please check the highlighted fields.", fieldErrors: errors }, 422);
  }
  const { name, email, subject, message, idempotencyKey, elapsedMs } = parsed.data;
  const data = { name, email, subject, message, idempotencyKey };
  if (elapsedMs !== undefined && elapsedMs < MIN_HUMAN_MS) return json({ status: "received" }, 202);

  try {
    const [existing] = await db
      .select({ id: schema.contactMessages.id })
      .from(schema.contactMessages)
      .where(eq(schema.contactMessages.idempotencyKey, data.idempotencyKey))
      .limit(1);
    if (existing) return json({ status: "received", replayed: true });

    const [row] = await db.insert(schema.contactMessages).values(data).onConflictDoNothing().returning();
    if (row) void notifyNewContact(row);
    return json({ status: "received" }, 201);
  } catch {
    console.error("[contact] failed to store message");
    return json({ error: "We couldn't send your message just now. Please try again in a moment." }, 500);
  }
}
