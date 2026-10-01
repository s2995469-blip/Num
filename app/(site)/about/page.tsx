import type { Metadata } from "next";
import Link from "next/link";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Arrow } from "@/components/ui/Arrow";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PractitionerPortrait } from "@/components/ui/PractitionerPortrait";
import { Reveal } from "@/components/ui/Reveal";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `Meet ${site.practitioner.name}, your guide at Powerhouse Numerology, and the approach behind every session.`,
  alternates: { canonical: "/about" },
};

const principles = [
  ["Your questions lead", "Sessions start from what you want to understand, not from a fixed script."],
  ["Honest about each practice", "Numerology and Reiki are offered as reflective and complementary practices — never as predictions, cures or guarantees."],
  ["Practical where it counts", "Career and relationship sessions focus on clear thinking and realistic next steps."],
  ["Discretion and care", "What you share is treated with respect, and only the information genuinely needed is ever requested."],
];

export default function AboutPage() {
  const { practitioner } = site;
  return (
    <>
      <section data-hero-tone="light" className="bg-porcelain" aria-labelledby="about-title">
        <div className="container-x grid items-end gap-14 pb-[var(--section-y)] pt-[calc(var(--header-h)+4rem)] lg:grid-cols-12 lg:pt-[calc(var(--header-h)+6rem)]">
          <div className="lg:col-span-7">
            <Eyebrow>About · Your guide</Eyebrow>
            <h1 id="about-title" className="display-xl mt-6 text-balance">
              {practitioner.name.split(" ")[0]} <span className="italic text-brass-deep">{practitioner.name.split(" ").slice(1).join(" ")}</span>
            </h1>
            {practitioner.biography.length > 0 ? (
              <div className="lede mt-10 max-w-2xl space-y-6 text-ink-soft">
                {practitioner.biography.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            ) : (
              <p className="lede mt-10 max-w-2xl text-ink-soft">
                {practitioner.name} is the guide behind Powerhouse Numerology, offering personal sessions in numerology, Reiki,
                career guidance and relationship guidance — each one a space to slow down, reflect and consider your next
                steps with intention.
              </p>
            )}
            {practitioner.credentials.length > 0 && (
              <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-soft">
                {practitioner.credentials.map((c) => (
                  <li key={c} className="flex items-center gap-3">
                    <span aria-hidden="true" className="h-px w-5 bg-brass" />
                    {c}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <PractitionerPortrait priority />
          </div>
        </div>
      </section>

      <section aria-labelledby="name-title" className="on-dark relative overflow-hidden bg-charcoal text-on-dark">
        <div className="container-x section-y grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <Eyebrow tone="dark">The name</Eyebrow>
            <h2 id="name-title" className="display-md mt-6">
              Why a tree, beneath an arch?
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="space-y-6 text-on-dark-soft lg:col-span-6 lg:col-start-7">
            <p>
              The Powerhouse mark shows a tree with numbers woven through its branches, held within an arch. Roots and
              branches suggest growth that is grounded; the arch suggests a threshold — a doorway into the next chapter.
            </p>
            <p>
              That&apos;s the spirit of every session: steady, personal reflection that helps you step forward with a little more
              clarity than before.
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="principles-title" className="bg-ivory">
        <div className="container-x section-y">
          <Reveal className="max-w-2xl">
            <Eyebrow>The approach</Eyebrow>
            <h2 id="principles-title" className="display-md mt-6">
              Four principles behind every session.
            </h2>
          </Reveal>
          <ol className="mt-14 grid gap-x-16 md:grid-cols-2">
            {principles.map(([t, d], i) => (
              <Reveal as="li" key={t} delay={(i % 2) * 0.06} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-line-light py-8">
                <span className="font-display text-2xl text-brass-deep">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-display text-[1.75rem] leading-tight">{t}</h3>
                  <p className="mt-3 text-ink-soft">{d}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <nav aria-label="Services" className="bg-porcelain">
        <div className="container-x section-y">
          <Eyebrow>Ways to work together</Eyebrow>
          <ul className="mt-10">
            {services.map((s) => (
              <li key={s.slug} className="border-t border-line-light last:border-b">
                <Link href={`/services/${s.slug}`} className="group grid items-baseline gap-4 py-7 md:grid-cols-12">
                  <span className="text-sm text-brass-deep md:col-span-1">{s.index}</span>
                  <span className="display-sm transition-colors group-hover:text-brass-deep md:col-span-4">{s.title}</span>
                  <span className="text-ink-soft md:col-span-6">{s.summary}</span>
                  <Arrow className="hidden text-brass-deep md:col-span-1 md:block md:justify-self-end" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <FinalCTA />
    </>
  );
}
