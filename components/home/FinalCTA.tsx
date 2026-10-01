import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCTA({
  title = (
    <>
      Your Next Chapter Starts With a <span className="italic">Conversation.</span>
    </>
  ),
  text = "Explore the services, ask a question, or arrange a session that feels right for you.",
  service,
}: {
  title?: React.ReactNode;
  text?: string;
  service?: string;
}) {
  return (
    <section aria-labelledby="final-cta-title" className="relative overflow-hidden bg-sandstone">
      {/* Architectural visual: a large arch opening onto warm light */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[18%] h-[130%] w-[min(78rem,140%)] -translate-x-1/2 rounded-t-full bg-[radial-gradient(60%_50%_at_50%_35%,#f7e7c6_0%,#ead9b9_45%,transparent_75%)]" />
        <div className="absolute left-1/2 top-[18%] h-[130%] w-[min(78rem,140%)] -translate-x-1/2 rounded-t-full border border-brass/40" />
        <div className="absolute left-1/2 top-[26%] h-[130%] w-[min(62rem,120%)] -translate-x-1/2 rounded-t-full border border-brass/20" />
      </div>

      <div className="container-x relative py-[clamp(7rem,14vw,12rem)] text-center">
        <Reveal>
          <h2 id="final-cta-title" className="display-lg mx-auto max-w-[18ch] text-espresso">
            {title}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="lede mx-auto mt-8 max-w-xl text-ink-soft">{text}</p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link href={service ? `/book-session?service=${service}` : "/book-session"} className="btn btn-primary">
              Book a Session <Arrow />
            </Link>
            <Link href="/contact" className="btn btn-ghost text-espresso">
              Get in Touch
            </Link>
          </div>
        </Reveal>
      </div>
      {/* Hairline into the footer */}
      <div aria-hidden="true" className="h-px bg-brass/50" />
    </section>
  );
}
