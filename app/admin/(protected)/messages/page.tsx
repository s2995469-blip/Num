import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/session";
import { db, schema } from "@/lib/db";
import { updateMessageStatus } from "../../actions";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage() {
  await requireAdmin();
  const rows = await db.select().from(schema.contactMessages).orderBy(desc(schema.contactMessages.createdAt)).limit(100);

  return (
    <>
      <h1 className="display-md">Messages</h1>
      <p className="mt-2 text-ink-soft">The 100 most recent messages from the contact form.</p>
      {rows.length === 0 ? (
        <p className="py-20 text-center text-ink-soft">No messages yet.</p>
      ) : (
        <ul className="mt-10 grid gap-6">
          {rows.map((m) => (
            <li key={m.id} className="rounded-sm bg-porcelain p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold">{m.subject}</h2>
                  <p className="mt-1 text-sm text-ink-soft">
                    {m.name} ·{" "}
                    <a className="underline underline-offset-4" href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`}>
                      {m.email}
                    </a>{" "}
                    · {m.createdAt.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
                <form action={updateMessageStatus} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={m.id} />
                  <label htmlFor={`st-${m.id}`} className="sr-only">
                    Status
                  </label>
                  <select id={`st-${m.id}`} name="status" defaultValue={m.status} className="field-input min-h-10 py-2 text-sm">
                    <option value="new">New</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                  <button type="submit" className="btn btn-ghost min-h-10 px-4 text-sm">
                    Update
                  </button>
                </form>
              </div>
              <p className="mt-4 whitespace-pre-line text-[0.95rem] text-ink-soft">{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
