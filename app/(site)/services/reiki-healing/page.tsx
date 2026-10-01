import type { Metadata } from "next";
import { FinalCTA } from "@/components/home/FinalCTA";
import { RelatedServices } from "@/components/services/RelatedServices";
import { Bullets, Note, Section } from "@/components/services/Section";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { ServiceHero } from "@/components/services/ServiceHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { getService } from "@/lib/services";
import { sessionFormatLabels, site } from "@/lib/site";

const service = getService("reiki-healing")!;

export const metadata: Metadata = {
  title: "Reiki Healing",
  description: service.metaDescription,
  alternates: { canonical: "/services/reiki-healing" },
  openGraph: { title: "Reiki Healing · Powerhouse Numerology", description: service.metaDescription, url: "/services/reiki-healing" },
};

const phases = [
  ["Arrive", "A short, unhurried conversation about how you're feeling and what you'd like from the time."],
  ["Rest", "You lie or sit comfortably, fully clothed, while the practitioner works slowly through a sequence of hand positions."],
  ["Return", "A few quiet minutes to come back gently, followed by space for any questions or reflections."],
];

export default function ReikiPage() {
  return (
    <>
      <ServiceHero
        slug="reiki-healing"
        index={service.index}
        eyebrow="Reiki"
        title={
          <>
            A quieter space, <span className="italic text-brass-deep">held with care.</span>
          </>
        }
        intro="Reiki is a gentle Japanese practice centred on rest and relaxation. Sessions offer a calm, intentional pause — time to slow down, breathe, and reflect."
        tone="light"
        layout="centered"
        background="bg-[radial-gradient(70%_60%_at_50%_70%,#f6e7c9_0%,#f7f4ed_65%)]"
        artBackground="bg-gradient-to-b from-[#3a3024] to-[#1f1b16]"
      />

      <Section eyebrow="About Reiki" title="What Reiki is — and what it isn't.">
        <div className="space-y-6 text-ink-soft">
          <p>
            Reiki was developed in Japan in the early twentieth century. A practitioner places their hands lightly on, or
            just above, different areas of the body while you rest. People most often describe the experience as deeply
            relaxing.
          </p>
          <p>
            Reiki is a <strong className="text-ink">complementary practice</strong>. It is offered as a space for
            relaxation and wellbeing, alongside — never instead of — the care you receive from medical and health
            professionals.
          </p>
        </div>
        <Note title="An important note" className="mt-10">
          Reiki does not diagnose, treat or cure any medical or psychological condition, and no particular outcome is
          promised. Please continue any treatment you are receiving and speak to your doctor about any health concerns.
        </Note>
      </Section>

      <section aria-labelledby="phases-title" className="bg-ivory">
        <div className="container-x section-y">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow className="justify-center">During a session</Eyebrow>
            <h2 id="phases-title" className="display-md mt-6">
              Three gentle movements.
            </h2>
          </Reveal>
          <ol className="mx-auto mt-16 grid max-w-5xl gap-12 md:grid-cols-3">
            {phases.map(([t, d], i) => (
              <Reveal as="li" key={t} delay={i * 0.1} className="text-center">
                <div aria-hidden="true" className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-brass/40">
                  <div className="rounded-full bg-champagne/40" style={{ width: `${40 + i * 18}%`, height: `${40 + i * 18}%` }} />
                </div>
                <h3 className="display-sm mt-8">{t}</h3>
                <p className="mx-auto mt-3 max-w-xs text-ink-soft">{d}</p>
              </Reveal>
            ))}
          </ol>
          <p className="mx-auto mt-14 max-w-xl text-center text-ink-soft">
            You are always in control — you can ask questions, change position, request a no-touch session, or pause at any
            time.
          </p>
        </div>
      </section>

      <Section eyebrow="Preparation" title="Before you arrive.">
        <Bullets
          items={[
            "Wear comfortable, loose clothing — you stay fully clothed throughout.",
            "Eat lightly beforehand and allow a few minutes to settle in.",
            "Mention anything that affects your comfort, such as difficulty lying flat or a preference for no touch.",
            "Allow a little quiet time afterwards; drink some water and take things gently.",
          ]}
        />
      </Section>

      <Section eyebrow="Formats" title="How sessions are offered." className="bg-ivory">
        {site.sessionFormats.length > 0 ? (
          <Bullets items={site.sessionFormats.map((f) => sessionFormatLabels[f])} />
        ) : (
          <p className="text-ink-soft">
            Session formats and durations are confirmed with you personally when your enquiry is answered. If you have a
            preference — for example, a particular time of day — include it in your message.
          </p>
        )}
      </Section>

      <ServiceFAQ faqs={service.faqs} />
      <RelatedServices current="reiki-healing" />
      <FinalCTA
        service="reiki-healing"
        title={
          <>
            Make time for <span className="italic">stillness.</span>
          </>
        }
        text="Send an enquiry with a preferred date. Your session is confirmed personally before anything is booked."
      />
    </>
  );
}
