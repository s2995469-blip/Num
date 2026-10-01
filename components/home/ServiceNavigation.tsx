"use client";

import Link from "next/link";
import { useState } from "react";
import { services, type ServiceSlug } from "@/lib/services";
import { ServiceArt } from "@/components/art/ServiceArt";
import { Arrow } from "@/components/ui/Arrow";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

const stageTint: Record<ServiceSlug, string> = {
  numerology: "from-[#2b2a24] to-[#1c1b17]",
  "reiki-healing": "from-[#33291d] to-[#1d1914]",
  "career-counselling": "from-[#262823] to-[#171814]",
  "relationship-counselling": "from-[#2a2729] to-[#1a1819]",
};

export function ServiceNavigation() {
  const [active, setActive] = useState<ServiceSlug>("numerology");

  return (
    <section id="services" aria-labelledby="services-title" className="on-dark relative bg-charcoal text-on-dark">
      {/* Soft curved transition out of the hero */}
      <div aria-hidden="true" className="absolute inset-x-0 -top-px h-24 bg-gradient-to-b from-espresso to-transparent" />

      <div className="container-x section-y relative">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <Eyebrow tone="dark">Four paths of guidance</Eyebrow>
            <h2 id="services-title" className="display-lg mt-6 max-w-[16ch]">
              Choose where you would like to begin.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <p className="text-on-dark-soft">
              Each service is a different doorway into the same intention: understanding yourself more clearly, and
              moving forward with care.
            </p>
          </Reveal>
        </div>

        {/* Desktop: list + art stage */}
        <div className="mt-20 hidden gap-12 lg:grid lg:grid-cols-12">
          <ul className="lg:col-span-6">
            {services.map((s) => {
              const isActive = s.slug === active;
              return (
                <li key={s.slug} className="border-t border-line-dark last:border-b">
                  <Link
                    href={`/services/${s.slug}`}
                    onMouseEnter={() => setActive(s.slug)}
                    onFocus={() => setActive(s.slug)}
                    aria-describedby={`svc-desc-${s.slug}`}
                    className="group grid grid-cols-[3.5rem_1fr_auto] items-baseline gap-x-4 py-8 outline-offset-8"
                  >
                    <span className={`text-sm tabular-nums transition-colors duration-500 ${isActive ? "text-champagne" : "text-on-dark-soft"}`}>
                      {s.index}
                    </span>
                    <span
                      className={`font-display text-[2.6rem] leading-none transition-[color,transform] duration-700 ease-out ${
                        isActive ? "translate-x-2 text-on-dark" : "text-on-dark/55"
                      }`}
                    >
                      {s.title}
                    </span>
                    <Arrow className={`transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`} />
                    <span
                      id={`svc-desc-${s.slug}`}
                      className={`col-start-2 col-end-4 grid transition-[grid-template-rows,opacity] duration-700 ease-out ${
                        isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <span className="overflow-hidden">
                        <span className="block max-w-md pt-4 text-on-dark-soft">{s.summary}</span>
                        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-champagne">
                          {s.cta}
                        </span>
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="lg:col-span-6">
            <div className="sticky top-28">
              <div className="arch-mask relative aspect-[6/7] overflow-hidden">
                {services.map((s) => (
                  <div
                    key={s.slug}
                    aria-hidden="true"
                    className={`absolute inset-0 bg-gradient-to-b ${stageTint[s.slug]} transition-opacity duration-1000 ${
                      s.slug === active ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <ServiceArt slug={s.slug} active={s.slug === active} idPrefix={`stage-${s.slug}`} className="h-full w-full" />
                  </div>
                ))}
                <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-champagne/20" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile & tablet: each service is its own tappable panel */}
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:hidden">
          {services.map((s, i) => (
            <Reveal as="li" key={s.slug} delay={i * 0.05}>
              <Link href={`/services/${s.slug}`} className="group block">
                <div className={`arch-mask relative aspect-[6/5] overflow-hidden bg-gradient-to-b ${stageTint[s.slug]}`}>
                  <ServiceArt slug={s.slug} idPrefix={`m-${s.slug}`} className="absolute inset-0 h-full w-full" />
                  <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-champagne/20" />
                </div>
                <div className="flex items-baseline gap-4 pt-6">
                  <span className="text-sm text-champagne">{s.index}</span>
                  <h3 className="font-display text-[2rem] leading-none">{s.title}</h3>
                </div>
                <p className="mt-3 text-on-dark-soft">{s.summary}</p>
                <span className="mt-4 inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-champagne">
                  {s.cta} <Arrow />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
