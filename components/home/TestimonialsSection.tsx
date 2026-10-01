import { testimonials } from "@/lib/testimonials";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

/** Renders only when genuine, approved testimonials exist in lib/testimonials.ts. */
export function TestimonialsSection() {
  if (testimonials.length === 0) return null;
  const [lead, ...rest] = testimonials;

  return (
    <section aria-labelledby="testimonials-title" className="bg-lavender">
      <div className="container-x section-y">
        <Eyebrow>Client experiences</Eyebrow>
        <h2 id="testimonials-title" className="sr-only">
          Client experiences
        </h2>
        <Reveal>
          <figure className="mt-10 max-w-4xl">
            <blockquote className="display-md">“{lead.quote}”</blockquote>
            <figcaption className="mt-8 text-ink-soft">
              — {lead.attribution}
              {lead.service ? `, ${lead.service}` : ""}
            </figcaption>
          </figure>
        </Reveal>
        {rest.length > 0 && (
          <ul className="mt-20 grid gap-12 border-t border-line-light pt-12 md:grid-cols-2">
            {rest.map((t, i) => (
              <Reveal as="li" key={i} delay={i * 0.08}>
                <figure>
                  <blockquote className="font-display text-2xl leading-snug">“{t.quote}”</blockquote>
                  <figcaption className="mt-4 text-sm text-ink-soft">— {t.attribution}</figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
