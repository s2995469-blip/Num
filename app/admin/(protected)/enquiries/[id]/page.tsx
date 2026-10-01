import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { statusLabels, statusStyles } from "@/components/admin/labels";
import { requireAdmin } from "@/lib/auth/session";
import { db, schema } from "@/lib/db";
import { getService } from "@/lib/services";
import { sessionFormatLabels, type SessionFormat } from "@/lib/site";
import { timeWindows } from "@/lib/validation/booking";
import { updateBooking } from "../../../actions";

export const metadata: Metadata = { title: "Enquiry" };

export default async function EnquiryPage({ params, searchParams }: PageProps<"/admin/enquiries/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const { saved } = await searchParams;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [b] = await db.select().from(schema.bookings).where(eq(schema.bookings.id, id)).limit(1);
  if (!b) notFound();

  const rows: [string, React.ReactNode][] = [
    ["Service", getService(b.service)?.label],
    ["Preferred date", b.preferredDate],
    ["Time window", timeWindows.find((t) => t.value === b.preferredTime)?.label ?? b.preferredTime],
    ["Format", b.sessionFormat ? (sessionFormatLabels[b.sessionFormat as SessionFormat] ?? b.sessionFormat) : "To be agreed"],
    ["Received", b.createdAt.toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" })],
    ["Privacy consent", b.privacyConsent ? "Given" : "Not given"],
  ];

  return (
    <>
      <Link href="/admin" className="link-underline text-sm text-ink-soft">
        ← All enquiries
      </Link>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <h1 className="display-md">{b.reference}</h1>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[b.status]}`}>{statusLabels[b.status]}</span>
      </div>
      {saved && (
        <p role="status" className="mt-6 border-l-2 border-brass bg-porcelain px-4 py-3 text-[0.95rem]">
          Changes saved.
        </p>
      )}

      <div className="mt-10 grid gap-12 lg:grid-cols-12">
        <section className="lg:col-span-7" aria-labelledby="details-title">
          <h2 id="details-title" className="display-sm">
            {b.name}
          </h2>
          <dl className="mt-6 grid gap-x-8 gap-y-4 text-[0.95rem] sm:grid-cols-[10rem_1fr]">
            <dt className="text-ink-soft">Email</dt>
            <dd>
              <a href={`mailto:${b.email}?subject=${encodeURIComponent(`Your enquiry ${b.reference}`)}`} className="underline underline-offset-4">
                {b.email}
              </a>
            </dd>
            <dt className="text-ink-soft">Phone</dt>
            <dd>{b.phone ? <a href={`tel:${b.phone.replace(/\s/g, "")}`} className="underline underline-offset-4">{b.phone}</a> : "—"}</dd>
            {rows.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-ink-soft">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
            {b.confirmedAt && (
              <>
                <dt className="text-ink-soft">Confirmed</dt>
                <dd>{b.confirmedAt.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</dd>
              </>
            )}
          </dl>
          <h3 className="mt-10 font-semibold">Message</h3>
          <p className="mt-3 whitespace-pre-line rounded-sm bg-porcelain p-5 text-[0.95rem] text-ink-soft">{b.message ?? "No message."}</p>
        </section>

        <section className="lg:col-span-4 lg:col-start-9" aria-labelledby="manage-title">
          <h2 id="manage-title" className="display-sm">
            Manage
          </h2>
          <form action={updateBooking} className="mt-6 grid gap-6">
            <input type="hidden" name="id" value={b.id} />
            <div>
              <label htmlFor="status" className="field-label">
                Status
              </label>
              <select id="status" name="status" defaultValue={b.status} className="field-input">
                {schema.bookingStatus.enumValues.map((s) => (
                  <option key={s} value={s}>
                    {statusLabels[s]}
                  </option>
                ))}
              </select>
              <p className="field-hint mt-2">Only mark Confirmed once you have agreed a time with the client.</p>
            </div>
            <div>
              <label htmlFor="adminNotes" className="field-label">
                Private notes
              </label>
              <textarea id="adminNotes" name="adminNotes" rows={6} maxLength={4000} defaultValue={b.adminNotes ?? ""} className="field-input" />
            </div>
            <button type="submit" className="btn btn-primary">
              Save changes
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
