import type { Metadata } from "next";
import Link from "next/link";
import { and, count, desc, eq, type SQL } from "drizzle-orm";
import { statusLabels, statusStyles } from "@/components/admin/labels";
import { requireAdmin } from "@/lib/auth/session";
import { db, schema } from "@/lib/db";
import type { BookingStatus } from "@/lib/db/schema";
import { getService, isServiceSlug, services } from "@/lib/services";
import { timeWindows } from "@/lib/validation/booking";

export const metadata: Metadata = { title: "Enquiries" };

const PAGE_SIZE = 25;
const statuses = schema.bookingStatus.enumValues;

export default async function EnquiriesPage({ searchParams }: PageProps<"/admin">) {
  await requireAdmin();
  const sp = await searchParams;
  const service = isServiceSlug(sp.service) ? sp.service : undefined;
  const status = statuses.includes(sp.status as BookingStatus) ? (sp.status as BookingStatus) : undefined;
  const page = Math.max(1, Number(sp.page) || 1);

  const where: SQL[] = [];
  if (service) where.push(eq(schema.bookings.service, service));
  if (status) where.push(eq(schema.bookings.status, status));
  const filter = where.length ? and(...where) : undefined;

  // Contact details are deliberately not selected for the list view.
  const [rows, [{ total }], counts] = await Promise.all([
    db
      .select({
        id: schema.bookings.id,
        reference: schema.bookings.reference,
        name: schema.bookings.name,
        service: schema.bookings.service,
        preferredDate: schema.bookings.preferredDate,
        preferredTime: schema.bookings.preferredTime,
        status: schema.bookings.status,
        createdAt: schema.bookings.createdAt,
      })
      .from(schema.bookings)
      .where(filter)
      .orderBy(desc(schema.bookings.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ total: count() }).from(schema.bookings).where(filter),
    db.select({ status: schema.bookings.status, n: count() }).from(schema.bookings).groupBy(schema.bookings.status),
  ]);

  const countFor = (s: BookingStatus) => counts.find((c) => c.status === s)?.n ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const qs = (extra: Record<string, string | number | undefined>) => {
    const p = new URLSearchParams();
    const merged = { service, status, ...extra };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, String(v));
    const s = p.toString();
    return s ? `?${s}` : "";
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="display-md">Enquiries</h1>
          <p className="mt-2 text-ink-soft">
            Enquiries become appointments only when you mark them <strong className="text-ink">Confirmed</strong>.
          </p>
        </div>
        <dl className="flex flex-wrap gap-6 text-sm">
          {statuses.map((s) => (
            <div key={s}>
              <dt className="text-ink-soft">{statusLabels[s]}</dt>
              <dd className="font-display text-2xl">{countFor(s)}</dd>
            </div>
          ))}
        </dl>
      </div>

      <form method="get" className="mt-10 flex flex-wrap items-end gap-4 border-y border-line-light py-5" aria-label="Filter enquiries">
        <div>
          <label htmlFor="f-service" className="field-label">
            Service
          </label>
          <select id="f-service" name="service" defaultValue={service ?? ""} className="field-input min-w-56">
            <option value="">All services</option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="f-status" className="field-label">
            Status
          </label>
          <select id="f-status" name="status" defaultValue={status ?? ""} className="field-input min-w-48">
            <option value="">All statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary min-h-[3.25rem]">
          Apply
        </button>
        {(service || status) && (
          <Link href="/admin" className="link-underline min-h-11 py-3 text-sm">
            Clear filters
          </Link>
        )}
      </form>

      {rows.length === 0 ? (
        <p className="py-20 text-center text-ink-soft">No enquiries match these filters yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left text-[0.95rem]">
            <caption className="sr-only">Session enquiries, newest first</caption>
            <thead className="text-sm text-ink-soft">
              <tr className="border-b border-line-light">
                <th scope="col" className="py-3 pr-4 font-medium">Reference</th>
                <th scope="col" className="py-3 pr-4 font-medium">Name</th>
                <th scope="col" className="py-3 pr-4 font-medium">Service</th>
                <th scope="col" className="py-3 pr-4 font-medium">Preferred</th>
                <th scope="col" className="py-3 pr-4 font-medium">Received</th>
                <th scope="col" className="py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-line-light hover:bg-porcelain">
                  <td className="py-4 pr-4">
                    <Link href={`/admin/enquiries/${r.id}`} className="font-semibold underline-offset-4 hover:underline">
                      {r.reference}
                    </Link>
                  </td>
                  <td className="py-4 pr-4">{r.name}</td>
                  <td className="py-4 pr-4">{getService(r.service)?.label}</td>
                  <td className="py-4 pr-4">
                    {r.preferredDate}
                    <span className="block text-sm text-ink-soft">{timeWindows.find((t) => t.value === r.preferredTime)?.label}</span>
                  </td>
                  <td className="py-4 pr-4 text-ink-soft">{r.createdAt.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</td>
                  <td className="py-4">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[r.status]}`}>{statusLabels[r.status]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-8 flex items-center gap-6 text-sm">
          {page > 1 && <Link href={`/admin${qs({ page: page - 1 })}`} className="link-underline">← Newer</Link>}
          <span className="text-ink-soft">
            Page {page} of {pages}
          </span>
          {page < pages && <Link href={`/admin${qs({ page: page + 1 })}`} className="link-underline">Older →</Link>}
        </nav>
      )}
    </>
  );
}
