import type { Metadata } from "next";
import { FinalCTA } from "@/components/home/FinalCTA";
import { RelatedServices } from "@/components/services/RelatedServices";
import { Bullets, Note, Section } from "@/components/services/Section";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { ServiceHero } from "@/components/services/ServiceHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { getService } from "@/lib/services";

const service = getService("relationship-counselling")!;

export const metadata: Metadata = {
  title: "Relationship Counselling",
  description: service.metaDescription,
  alternates: { canonical: "/services/relationship-counselling" },
  openGraph: {
    title: "Relationship Counselling · Powerhouse Numerology",
    description: service.metaDescription,
    url: "/services/relationship-counselling",
  },
};

const themes = [
  ["Communication", "How you speak and listen when it matters — and what gets in the way."],
  ["Boundaries", "Recognising your limits and expressing them clearly and kindly."],
  ["Patterns", "Noticing the cycles that repeat across conversations, conflicts and relationships."],
  ["Reflection", "Making sense of what you want, what you've learned, and what you'd like to change."],
];

export default function RelationshipPage() {
  return (
    <>
      <ServiceHero
        slug="relationship-counselling"
        index={service.index}
        eyebrow="Relationship guidance"
        title={
          <>
            Closer, clearer, <span className="italic text-brass-deep">kinder.</span>
          </>
        }
        intro="Reflective one-to-one conversations about communication, personal boundaries and relationship patterns — with partners, family, friends or colleagues."
        tone="light"
        layout="art-right"
        background="bg-[linear-gradient(180deg,#e8e5ed_0%,#f7f4ed_100%)]"
        artBackground="bg-gradient-to-b from-[#2c292b] to-[#1a1819]"
      />

      <Section eyebrow="The service" title="A calm space to understand what's happening between you.">
        <div className="space-y-6 text-ink-soft">
          <p>
            Relationships shape so much of how we feel. These sessions offer a confidential, unhurried space to reflect on
            a relationship — romantic, family, friendship or work — and to explore new ways of approaching it.
          </p>
          <p>
            Sessions are described as <strong className="text-ink">individual, one-to-one guidance</strong>. If you&apos;d
            like to attend with a partner or family member, mention it in your enquiry and you&apos;ll be told whether a
            joint session is available.
          </p>
        </div>
      </Section>

      <section aria-labelledby="themes-title" className="bg-ivory">
        <div className="container-x section-y">
          <Reveal className="max-w-2xl">
            <Eyebrow>What we explore</Eyebrow>
            <h2 id="themes-title" className="display-md mt-6">
              Four threads, woven through every conversation.
            </h2>
          </Reveal>
          <ul className="mt-14">
            {themes.map(([t, d], i) => (
              <Reveal as="li" key={t} delay={i * 0.05} className="group grid items-baseline gap-3 border-t border-line-light py-8 last:border-b md:grid-cols-12">
                <h3 className="display-lg md:col-span-6">{t}</h3>
                <p className="text-ink-soft md:col-span-5 md:col-start-8">{d}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Section eyebrow="Format & expectations" title="What to expect.">
        <Bullets
          items={[
            "A confidential conversation, led by your questions and at your pace.",
            "Practical reflection: what's happening, what you need, and what you could try.",
            "No judgement and no pressure to make decisions in the session.",
            "Session formats and durations are confirmed personally when your enquiry is answered.",
          ]}
        />
      </Section>

      <section aria-label="Important information" className="bg-porcelain">
        <div className="container-x pb-[var(--section-y)]">
          <div className="grid gap-6 md:grid-cols-2">
            <Note title="This is not therapy">
              Sessions are reflective guidance, not psychotherapy or clinical counselling, and the practitioner is not
              presented as a licensed therapist. For mental-health difficulties, trauma or abuse, please contact a licensed
              professional.
            </Note>
            <Note title="Not an emergency service">
              If you or someone else is in danger, or a relationship involves fear, coercion or harm, please contact local
              emergency services or a dedicated support service straight away.
            </Note>
          </div>
        </div>
      </section>

      <ServiceFAQ faqs={service.faqs} className="bg-ivory" />
      <RelatedServices current="relationship-counselling" />
      <FinalCTA
        service="relationship-counselling"
        title={
          <>
            Start with a <span className="italic">conversation.</span>
          </>
        }
        text="Send an enquiry with a preferred date. Your session is confirmed personally before anything is booked."
      />
    </>
  );
}
