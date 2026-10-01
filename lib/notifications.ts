import "server-only";
import type { Booking, ContactMessage } from "./db/schema";
import { getService } from "./services";

/**
 * Notification seam. With RESEND_API_KEY, NOTIFY_EMAIL_TO and EMAIL_FROM set,
 * the practitioner receives a short email for each new enquiry. Without them
 * nothing is sent (and nothing is claimed to be sent) — enquiries are still
 * stored and visible in /admin.
 *
 * The email deliberately omits the visitor's message; it links to the admin
 * area instead, so personal details stay inside the authenticated system.
 */
type Notice = { subject: string; text: string };

function configured() {
  const { RESEND_API_KEY, NOTIFY_EMAIL_TO, EMAIL_FROM } = process.env;
  return RESEND_API_KEY && NOTIFY_EMAIL_TO && EMAIL_FROM
    ? { key: RESEND_API_KEY, to: NOTIFY_EMAIL_TO, from: EMAIL_FROM }
    : null;
}

async function send(notice: Notice) {
  const cfg = configured();
  if (!cfg) return { sent: false as const, reason: "not-configured" };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${cfg.key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: cfg.from, to: cfg.to, subject: notice.subject, text: notice.text }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error(`[notifications] provider responded ${res.status}`);
      return { sent: false as const, reason: "provider-error" };
    }
    return { sent: true as const };
  } catch {
    console.error("[notifications] provider request failed");
    return { sent: false as const, reason: "network" };
  }
}

const adminUrl = (path: string) =>
  `${(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "")}${path}`;

export function notifyNewBooking(b: Booking) {
  return send({
    subject: `New enquiry ${b.reference} — ${getService(b.service)?.label ?? b.service}`,
    text: [
      `A new session enquiry (${b.reference}) has been received.`,
      `Service: ${getService(b.service)?.label ?? b.service}`,
      `Preferred date: ${b.preferredDate} (${b.preferredTime})`,
      "",
      `Review it here: ${adminUrl(`/admin/enquiries/${b.id}`)}`,
    ].join("\n"),
  });
}

export function notifyNewContact(m: ContactMessage) {
  return send({
    subject: `New message via the website (${m.createdAt.toISOString().slice(0, 10)})`,
    text: [`A new contact message has been received.`, "", `Review it here: ${adminUrl("/admin/messages")}`].join("\n"),
  });
}
