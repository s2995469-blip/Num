import Link from "next/link";
import { site } from "@/lib/site";
import { Arrow } from "@/components/ui/Arrow";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PractitionerPortrait } from "@/components/ui/PractitionerPortrait";
import { Reveal } from "@/components/ui/Reveal";

export function AboutSection() {
  return (
    <section id="approach" aria-labelledby="approach-title" className="relative bg-porcelain">
      {/* Dark-to-light threshold: an arch of porcelain rising out of the charcoal */}
      <div aria-hidden="true" className="h-20 bg-charcoal md:h-28">
        <div className="mx-auto h-full w-[min(96%,var(--max))] rounded-t-[999px_100%] bg-porcelain" />
      </div>

      <div className="container-x pb-[var(--section-y)] pt-10">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-5 lg:col-start-1">
            <PractitionerPortrait className="mx-auto max-w-sm lg:max-w-none" />
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <Eyebrow>Your guide · {site.practitioner.name}</Eyebrow>
              <h2 id="approach-title" className="display-lg mt-6 max-w-[14ch]">
                A Journey of <span className="italic text-brass-deep">Self-Discovery</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lede mt-8 max-w-xl text-ink-soft">
                Every person has a unique story. Through personalised guidance, reflective practices, and thoughtful
                conversations, Powerhouse Numerology creates space to explore that story and consider your next steps.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <dl className="mt-12 grid gap-8 border-t border-line-light pt-10 sm:grid-cols-3">
                {[
                  ["Personal", "Every session starts from your questions, not a script."],
                  ["Reflective", "Numbers and practices are prompts for thought, never verdicts."],
                  ["Grounded", "Clear about what each practice is — and what it isn't."],
                ].map(([t, d]) => (
                  <div key={t}>
                    <dt className="font-display text-2xl">{t}</dt>
                    <dd className="mt-2 text-[0.95rem] text-ink-soft">{d}</dd>
                  </div>
                ))}
              </dl>
              <Link href="/about" className="btn btn-primary mt-12">
                Meet Your Guide <Arrow />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
