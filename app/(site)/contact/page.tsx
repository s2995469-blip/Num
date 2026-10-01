import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/booking/ContactForm";
import { Arrow } from "@/components/ui/Arrow";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Ask a question or get in touch with Powerhouse Numerology.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const { contact } = site;
  return (
    <section data-hero-tone="light" className="bg-porcelain" aria-labelledby="contact-title">
      <div className="container-x grid gap-16 pb-[var(--section-y)] pt-[calc(var(--header-h)+4rem)] lg:grid-cols-12 lg:pt-[calc(var(--header-h)+6rem)]">
        <div className="lg:col-span-5">
          <Eyebrow>Contact</Eyebrow>
          <h1 id="contact-title" className="display-lg mt-6">
            Ask anything. <span className="italic text-brass-deep">Begin gently.</span>
          </h1>
          <p className="mt-8 max-w-md text-ink-soft">
            Not sure which service is right for you, or have a question before booking? Send a message and you&apos;ll receive a
            personal reply.
          </p>
          {(contact.email || contact.phone || contact.address || contact.hours) && (
            <dl className="mt-12 grid gap-6 border-t border-line-light pt-8">
              {contact.email && (
                <div>
                  <dt className="eyebrow text-brass-deep">Email</dt>
                  <dd className="mt-1">
                    <a href={`mailto:${contact.email}`} className="link-underline">
                      {contact.email}
                    </a>
                  </dd>
                </div>
              )}
              {contact.phone && (
                <div>
                  <dt className="eyebrow text-brass-deep">Phone</dt>
                  <dd className="mt-1">
                    <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="link-underline">
                      {contact.phone}
                    </a>
                  </dd>
                </div>
              )}
              {contact.address && (
                <div>
                  <dt className="eyebrow text-brass-deep">Studio</dt>
                  <dd className="mt-1 whitespace-pre-line">{contact.address}</dd>
                </div>
              )}
              {contact.hours && (
                <div>
                  <dt className="eyebrow text-brass-deep">Hours</dt>
                  <dd className="mt-1">{contact.hours}</dd>
                </div>
              )}
            </dl>
          )}
          <div className="mt-12 rounded-sm bg-ivory p-6">
            <p className="font-semibold">Ready to book?</p>
            <p className="mt-1 text-[0.95rem] text-ink-soft">Use the booking form to suggest a date for your session.</p>
            <Link href="/book-session" className="link-arrow group mt-4 inline-flex min-h-11 items-center gap-3 font-semibold">
              <span className="link-underline">Book a Session</span> <Arrow />
            </Link>
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
