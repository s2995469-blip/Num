import type { Metadata } from "next";
import Link from "next/link";
import { ServiceArt } from "@/components/art/ServiceArt";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Arrow } from "@/components/ui/Arrow";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Numerology, Reiki healing, career counselling and relationship counselling at Powerhouse Numerology — four ways to reflect, rest and move forward.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <section data-hero-tone="light" className="bg-porcelain" aria-labelledby="services-page-title">
        <div className="container-x pb-16 pt-[calc(var(--header-h)+4rem)] lg:pt-[calc(var(--header-h)+6rem)]">
          <Eyebrow>Services</Eyebrow>
          <h1 id="services-page-title" className="display-xl mt-6 max-w-[14ch] text-balance">
            Four doorways, <span className="italic text-brass-deep">one intention.</span>
          </h1>
          <p className="lede mt-8 max-w-2xl text-ink-soft">
            Whether you&apos;re drawn to the symbolism of numbers, a quiet hour of rest, or a practical conversation about work
            or relationships, every session begins with you.
          </p>
        </div>
      </section>

      <section aria-label="All services" className="bg-porcelain pb-[var(--section-y)]">
        <div className="container-x grid gap-y-24">
          {services.map((s, i) => (
            <Reveal key={s.slug} className="grid items-center gap-10 md:grid-cols-12">
              <Link
                href={`/services/${s.slug}`}
                tabIndex={-1}
                aria-hidden="true"
                className={`group arch-mask relative block aspect-[6/7] overflow-hidden bg-gradient-to-b from-[#2b2a24] to-[#171612] md:col-span-5 ${
                  i % 2 ? "md:order-2 md:col-start-8" : ""
                }`}
              >
                <ServiceArt slug={s.slug} idPrefix={`list-${s.slug}`} className="absolute inset-0 h-full w-full" />
              </Link>
              <div className={`md:col-span-6 ${i % 2 ? "md:order-1 md:col-start-1" : "md:col-start-7"}`}>
                <p className="font-display text-5xl text-brass-deep">{s.index}</p>
                <h2 className="display-lg mt-4">{s.title}</h2>
                <p className="lede mt-6 max-w-lg text-ink-soft">{s.summary}</p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href={`/services/${s.slug}`} className="btn btn-primary">
                    {s.cta} <Arrow />
                  </Link>
                  <Link href={`/book-session?service=${s.slug}`} className="btn btn-ghost">
                    Book
                    <span className="sr-only"> {s.title}</span>
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
