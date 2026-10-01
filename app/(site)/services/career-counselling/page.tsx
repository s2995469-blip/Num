import type { Metadata } from "next";
import { FinalCTA } from "@/components/home/FinalCTA";
import { RelatedServices } from "@/components/services/RelatedServices";
import { Bullets, Note, Section } from "@/components/services/Section";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { ServiceHero } from "@/components/services/ServiceHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { getService } from "@/lib/services";

const service = getService("career-counselling")!;

export const metadata: Metadata = {
  title: "Career Counselling",
  description: service.metaDescription,
  alternates: { canonical: "/services/career-counselling" },
  openGraph: { title: "Career Counselling · Powerhouse Numerology", description: service.metaDescription, url: "/services/career-counselling" },
};

const topics = [
  ["Interests & energy", "What you enjoy, what drains you, and the patterns that show up across roles."],
  ["Values & priorities", "What matters most now — and which compromises feel acceptable."],
  ["Options & trade-offs", "Laying out paths side by side so choices become concrete rather than abstract."],
  ["Transitions", "Changing field, returning to work, starting out, or stepping back."],
  ["Confidence & clarity", "Untangling competing voices and expectations from what you actually want."],
  ["Next steps", "Small, practical experiments to learn more before committing."],
];

export default function CareerPage() {
  return (
    <>
      <ServiceHero
        slug="career-counselling"
        index={service.index}
        eyebrow="Career guidance"
        title={
          <>
            See the path <span className="italic text-brass-deep">more clearly.</span>
          </>
        }
        intro="A structured, practical conversation about your interests, experience and options — to help you approach career decisions with greater clarity and confidence."
        tone="light"
        layout="art-left"
        background="bg-ivory"
        artBackground="bg-gradient-to-b from-[#2a2b26] to-[#161713]"
      />

      <Section eyebrow="Purpose" title="Thinking clearly about work, without being told what to do.">
        <div className="space-y-6 text-ink-soft">
          <p>
            Career decisions are rarely just about jobs. They touch identity, money, relationships and time. These
            sessions offer a calm space to step back, ask better questions and turn a vague sense of &quot;something needs to
            change&quot; into options you can actually evaluate.
          </p>
          <p>The decision always remains yours. The aim is to help you make it with more clarity.</p>
        </div>
      </Section>

      <section aria-labelledby="topics-title" className="on-dark bg-charcoal text-on-dark">
        <div className="container-x section-y">
          <Reveal className="max-w-2xl">
            <Eyebrow tone="dark">Topics we can explore</Eyebrow>
            <h2 id="topics-title" className="display-md mt-6">
              Where the conversation can go.
            </h2>
          </Reveal>
          <dl className="mt-16 grid gap-x-16 md:grid-cols-2">
            {topics.map(([t, d], i) => (
              <Reveal key={t} delay={(i % 2) * 0.06} className="border-t border-line-dark py-8">
                <dt className="font-display text-[1.75rem] leading-tight">{t}</dt>
                <dd className="mt-3 text-on-dark-soft">{d}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="approach-title" className="bg-porcelain">
        <div className="container-x section-y">
          <Reveal className="max-w-3xl">
            <Eyebrow>Two distinct approaches</Eyebrow>
            <h2 id="approach-title" className="display-md mt-6">
              Practical guidance first. A numerology lens only if you ask for it.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-px overflow-hidden rounded-sm bg-line-light md:grid-cols-2">
            <Reveal className="bg-porcelain p-8 md:p-12">
              <p className="eyebrow text-brass-deep">Conventional career guidance</p>
              <h3 className="display-sm mt-4">The core of every session</h3>
              <Bullets
                className="mt-6"
                items={[
                  "Structured questions about interests, skills, values and constraints",
                  "Comparing options and their trade-offs",
                  "Identifying realistic, testable next steps",
                ]}
              />
            </Reveal>
            <Reveal delay={0.08} className="bg-ivory p-8 md:p-12">
              <p className="eyebrow text-brass-deep">Optional numerology perspective</p>
              <h3 className="display-sm mt-4">A reflective add-on</h3>
              <Bullets
                className="mt-6"
                items={[
                  "Uses traditional number meanings as prompts for self-reflection",
                  "Clearly labelled as interpretive — never a prediction of success",
                  "Included only if you request it",
                ]}
              />
            </Reveal>
          </div>
          <Note title="Qualifications" className="mt-10 max-w-3xl">
            Professional qualifications will be listed here once confirmed. For regulated matters — employment law, finance,
            immigration — please consult an appropriately qualified adviser.
          </Note>
        </div>
      </section>

      <Section eyebrow="How a session works" title="Clear, structured, and yours." className="bg-ivory">
        <ol className="grid gap-8">
          {[
            ["Before", "Share a little about your situation in your enquiry, if you'd like. Nothing is required in advance."],
            ["During", "We map where you are, what matters, and the options in front of you — then test them against each other."],
            ["After", "You leave with clearer questions, a short list of options, and one or two concrete next steps."],
          ].map(([t, d]) => (
            <li key={t} className="grid gap-2 border-t border-line-light pt-6 md:grid-cols-[8rem_1fr]">
              <h3 className="font-display text-2xl">{t}</h3>
              <p className="text-ink-soft">{d}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="Who it's for" title="Wherever you are in your working life.">
        <Bullets
          items={[
            "Students and graduates choosing a direction",
            "Professionals considering a change of role or field",
            "People returning to work after a break",
            "Anyone who feels stuck and would value a structured conversation",
          ]}
        />
      </Section>

      <ServiceFAQ faqs={service.faqs} className="bg-ivory" />
      <RelatedServices current="career-counselling" />
      <FinalCTA
        service="career-counselling"
        title={
          <>
            Ready to think it <span className="italic">through?</span>
          </>
        }
        text="Send an enquiry with a preferred date. You'll hear back personally to confirm your session."
      />
    </>
  );
}
