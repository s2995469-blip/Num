import type { FAQ } from "@/lib/services";
import { Eyebrow } from "@/components/ui/Eyebrow";

/** Native <details> accordion: keyboard and screen-reader friendly without JS. */
export function ServiceFAQ({ faqs, title = "Questions & answers", className = "bg-porcelain" }: { faqs: FAQ[]; title?: string; className?: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <section id="faq" aria-labelledby="faq-title" className={className}>
      <div className="container-x section-y grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Eyebrow>FAQ</Eyebrow>
          <h2 id="faq-title" className="display-md mt-6">
            {title}
          </h2>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          {faqs.map((f) => (
            <details key={f.q} className="group border-t border-line-light last:border-b">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-[1.45rem] leading-snug [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden="true" className="relative h-4 w-4 shrink-0 text-brass-deep">
                  <span className="absolute left-0 top-1/2 h-px w-4 bg-current" />
                  <span className="absolute left-1/2 top-0 h-4 w-px bg-current transition-transform duration-500 group-open:scale-y-0" />
                </span>
              </summary>
              <p className="max-w-2xl pb-8 text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </section>
  );
}
