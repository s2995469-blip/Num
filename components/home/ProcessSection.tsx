import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

const steps = [
  {
    n: "01",
    title: "Discover",
    text: "Explore the available services and select the type of guidance you are looking for.",
  },
  {
    n: "02",
    title: "Connect",
    text: "Submit an enquiry and share your preferred appointment details.",
  },
  {
    n: "03",
    title: "Begin",
    text: "The practitioner confirms the session and explains the next steps.",
  },
];

/** One evolving geometric mark per step: a point, two circles meeting, a circle within an arch. */
function StepMark({ i }: { i: number }) {
  return (
    <svg viewBox="0 0 120 120" className="h-24 w-24 text-brass-deep" aria-hidden="true" fill="none" stroke="currentColor">
      {i === 0 && (
        <>
          <circle cx="60" cy="60" r="44" strokeOpacity="0.25" />
          <circle cx="60" cy="60" r="4" fill="currentColor" stroke="none" />
        </>
      )}
      {i === 1 && (
        <>
          <circle cx="46" cy="60" r="28" />
          <circle cx="74" cy="60" r="28" strokeOpacity="0.55" />
        </>
      )}
      {i === 2 && (
        <>
          <path d="M22 108 V56 A38 38 0 0 1 98 56 V108" />
          <circle cx="60" cy="76" r="16" fill="currentColor" fillOpacity="0.12" />
        </>
      )}
    </svg>
  );
}

export function ProcessSection() {
  return (
    <section aria-labelledby="process-title" className="bg-ivory">
      <div className="container-x section-y">
        <Reveal className="max-w-2xl">
          <Eyebrow>How it works</Eyebrow>
          <h2 id="process-title" className="display-md mt-6">
            Three unhurried steps from first question to first session.
          </h2>
        </Reveal>

        <div className="relative mt-20">
          {/* Connecting line */}
          <div aria-hidden="true" className="absolute left-12 top-12 hidden h-px w-[calc(100%-6rem)] bg-brass/40 md:block" />
          <div aria-hidden="true" className="absolute bottom-0 left-12 top-12 w-px bg-brass/30 md:hidden" />
        <ol className="relative grid gap-16 md:grid-cols-3 md:gap-10">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 0.12} className="relative grid grid-cols-[6rem_1fr] gap-6 md:block">
              <div className="relative bg-ivory md:inline-block md:pr-4">
                <StepMark i={i} />
              </div>
              <div className="md:mt-8">
                <p className="text-sm tabular-nums text-brass-deep">{s.n}</p>
                <h3 className="display-sm mt-2">{s.title}</h3>
                <p className="mt-3 max-w-xs text-ink-soft">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
        </div>
      </div>
    </section>
  );
}
