import type { Metadata } from "next";
import { BookingForm } from "@/components/booking/BookingForm";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { isServiceSlug } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a Session",
  description: "Send a session enquiry for numerology, Reiki, career or relationship guidance. Every session is confirmed personally.",
  alternates: { canonical: "/book-session" },
};

export default async function BookSessionPage({ searchParams }: PageProps<"/book-session">) {
  const { service } = await searchParams;
  const initial = isServiceSlug(service) ? service : undefined;

  return (
    <section data-hero-tone="light" className="bg-porcelain" aria-labelledby="book-title">
      <div className="container-x grid gap-16 pb-[var(--section-y)] pt-[calc(var(--header-h)+4rem)] lg:grid-cols-12 lg:pt-[calc(var(--header-h)+6rem)]">
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Eyebrow>Book a session</Eyebrow>
            <h1 id="book-title" className="display-lg mt-6">
              Let&apos;s find <span className="italic text-brass-deep">a time.</span>
            </h1>
            <p className="mt-8 text-ink-soft">
              Share a few details and a preferred date. {site.practitioner.name} will reply personally to confirm your
              session — nothing is booked until then.
            </p>
            <ol className="mt-12 grid gap-6 border-t border-line-light pt-8 text-[0.95rem]">
              {[
                ["01", "Send your enquiry", "It takes about two minutes."],
                ["02", "Receive a reply", "Your preferred time is checked and confirmed, or an alternative suggested."],
                ["03", "Prepare", "You'll be told anything you need before your session."],
              ].map(([n, t, d]) => (
                <li key={n} className="grid grid-cols-[2.5rem_1fr]">
                  <span className="text-brass-deep">{n}</span>
                  <span>
                    <span className="font-semibold">{t}</span>
                    <span className="block text-ink-soft">{d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
        <div className="lg:col-span-7 lg:col-start-6">
          <BookingForm initialService={initial} />
        </div>
      </div>
    </section>
  );
}
