import type { Metadata } from "next";
import Link from "next/link";
import { FinalCTA } from "@/components/home/FinalCTA";
import { RelatedServices } from "@/components/services/RelatedServices";
import { Bullets, Note, Section } from "@/components/services/Section";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { ServiceHero } from "@/components/services/ServiceHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { getService } from "@/lib/services";

const service = getService("numerology")!;

export const metadata: Metadata = {
  title: "Numerology",
  description: service.metaDescription,
  alternates: { canonical: "/services/numerology" },
  openGraph: { title: "Numerology · Powerhouse Numerology", description: service.metaDescription, url: "/services/numerology" },
};

const coreNumbers = [
  ["Life Path", "Drawn from your full date of birth; often read as the central theme of a reading."],
  ["Expression", "Drawn from the letters of your birth name; associated with natural abilities and ways of working."],
  ["Soul Urge", "Drawn from the vowels of your name; linked with inner motivations and what feels meaningful."],
  ["Personality", "Drawn from the consonants; associated with how others may first experience you."],
  ["Personal Year", "Your birth date combined with the current year; used to reflect on the themes of a particular year."],
];

export default function NumerologyPage() {
  return (
    <>
      <ServiceHero
        slug="numerology"
        index={service.index}
        eyebrow="Personal numerology"
        title={
          <>
            The numbers in your name, <span className="italic text-champagne">read as a mirror.</span>
          </>
        }
        intro="A personal numerology session uses the traditional meanings of numbers as a structured prompt for reflection — on your strengths, recurring patterns, and the direction you'd like to take."
        tone="dark"
        layout="art-right"
        background="bg-charcoal"
        artBackground="bg-gradient-to-b from-[#2f2d27] to-[#1c1b17]"
      />

      <section aria-labelledby="what-title" className="bg-porcelain">
        <div className="container-x section-y grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <Eyebrow>What numerology is</Eyebrow>
            <h2 id="what-title" className="display-md mt-6">
              An old, interpretive language — used for reflection, not prediction.
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="space-y-6 text-ink-soft lg:col-span-6 lg:col-start-7">
            <p>
              Numerology assigns symbolic meanings to numbers and applies them to names and dates. It draws on several
              traditions — Pythagorean, Chaldean and others — each with slightly different methods.
            </p>
            <p>
              It is not a science, and it can&apos;t tell you what will happen. What it can offer is a vocabulary: a set of
              themes that invite you to notice how you work, what motivates you, and where you feel stuck. Many people find
              that useful, whether or not they &quot;believe&quot; in it.
            </p>
            <blockquote className="border-l border-brass pl-6 font-display text-[1.7rem] leading-snug text-ink">
              The numbers don&apos;t decide anything. They offer a different angle on the decisions you&apos;re already
              facing.
            </blockquote>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="numbers-title" className="on-dark bg-espresso text-on-dark">
        <div className="container-x section-y">
          <Reveal className="max-w-2xl">
            <Eyebrow tone="dark">What a session may cover</Eyebrow>
            <h2 id="numbers-title" className="display-md mt-6">
              The core numbers, explored in conversation.
            </h2>
          </Reveal>
          <ol className="mt-16">
            {coreNumbers.map(([name, text], i) => (
              <Reveal as="li" key={name} delay={i * 0.05} className="grid gap-4 border-t border-line-dark py-8 md:grid-cols-12 md:items-baseline">
                <span className="font-display text-5xl text-champagne md:col-span-2">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-3xl md:col-span-4">{name}</h3>
                <p className="text-on-dark-soft md:col-span-6">{text}</p>
              </Reveal>
            ))}
          </ol>
          <p className="mt-10 max-w-2xl text-sm text-on-dark-soft">
            Not every session covers every number — you choose where to focus, and the conversation follows what&apos;s
            useful to you.
          </p>
        </div>
      </section>

      <Section eyebrow="Who it's for" title="For the curious, the reflective, and anyone at a crossroads." className="bg-ivory">
        <Bullets
          items={[
            "You're curious about numerology and want a thoughtful, grounded introduction.",
            "You're in a period of change and would like a structured way to reflect.",
            "You enjoy symbolic frameworks as prompts for self-understanding.",
            "You'd like a calm, personal conversation focused entirely on you.",
          ]}
        />
      </Section>

      <Section eyebrow="How it works" title="From enquiry to reading.">
        <ol className="grid gap-10">
          {[
            ["Send an enquiry", "Choose Numerology on the booking form and suggest a date and time window."],
            ["Confirmation", "Your session is confirmed personally, along with the details needed to prepare your reading."],
            ["Preparation", "Your numbers are calculated and studied in advance, so the session can be spent in conversation."],
            ["The session", "Together you explore the themes that resonate, the ones that don't, and what you might take forward."],
          ].map(([t, d], i) => (
            <li key={t} className="grid grid-cols-[3rem_1fr] gap-4">
              <span className="font-display text-3xl text-brass-deep">{i + 1}</span>
              <div>
                <h3 className="text-lg font-semibold">{t}</h3>
                <p className="mt-1 text-ink-soft">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="What you'll need" title="Only what's necessary, only when it's needed." className="bg-ivory">
        <p className="text-ink-soft">
          A reading is usually based on your <strong className="text-ink">full name as given at birth</strong> and your{" "}
          <strong className="text-ink">date of birth</strong>. You don&apos;t need to share either when you first enquire —
          the booking form deliberately doesn&apos;t ask for them.
        </p>
        <Note title="Why we ask later" className="mt-8">
          Birth details are personal. They are requested only after your session is confirmed, used solely to prepare your
          reading, and handled as described in the{" "}
          <Link href="/privacy" className="underline underline-offset-4">
            privacy policy
          </Link>
          .
        </Note>
      </Section>

      <ServiceFAQ faqs={service.faqs} />
      <RelatedServices current="numerology" />
      <FinalCTA
        service="numerology"
        title={
          <>
            Curious about <span className="italic">your numbers?</span>
          </>
        }
        text="Send an enquiry with a preferred date. You'll hear back personally to confirm your session."
      />
    </>
  );
}
