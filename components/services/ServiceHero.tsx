import Link from "next/link";
import type { ServiceSlug } from "@/lib/services";
import { ServiceArt } from "@/components/art/ServiceArt";
import { Arrow } from "@/components/ui/Arrow";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Props = {
  slug: ServiceSlug;
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
  tone: "dark" | "light";
  layout: "art-right" | "art-left" | "centered";
  background: string;
  artBackground?: string;
};

export function ServiceHero({ slug, index, eyebrow, title, intro, tone, layout, background, artBackground = "" }: Props) {
  const dark = tone === "dark";
  const text = dark ? "text-on-dark" : "text-ink";
  const soft = dark ? "text-on-dark-soft" : "text-ink-soft";

  const Copy = (
    <div className={layout === "centered" ? "mx-auto max-w-3xl text-center" : ""}>
      <nav aria-label="Breadcrumb" className={`text-sm ${soft}`}>
        <ol className={`flex flex-wrap gap-2 ${layout === "centered" ? "justify-center" : ""}`}>
          <li>
            <Link href="/" className="link-underline">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/services" className="link-underline">
              Services
            </Link>
          </li>
        </ol>
      </nav>
      <Eyebrow tone={dark ? "dark" : "light"} className={`mt-10 ${layout === "centered" ? "justify-center" : ""}`}>
        {index} · {eyebrow}
      </Eyebrow>
      <h1 id="service-hero-title" className={`display-xl mt-6 text-balance ${text}`}>{title}</h1>
      <p className={`lede mt-8 max-w-xl ${soft} ${layout === "centered" ? "mx-auto" : ""}`}>{intro}</p>
      <div className={`mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 ${layout === "centered" ? "justify-center" : ""}`}>
        <Link href={`/book-session?service=${slug}`} className={`btn ${dark ? "btn-light" : "btn-primary"}`}>
          Book a Session <Arrow />
        </Link>
        <a href="#faq" className="link-arrow group inline-flex min-h-11 items-center gap-3 font-semibold">
          <span className="link-underline">Questions &amp; answers</span>
        </a>
      </div>
    </div>
  );

  const Art = (
    <div className={`arch-mask relative mx-auto aspect-[6/7] w-full max-w-[34rem] overflow-hidden ${artBackground}`}>
      <ServiceArt slug={slug} active idPrefix={`hero-${slug}`} className="absolute inset-0 h-full w-full" />
      <div className={`pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ${dark ? "ring-champagne/20" : "ring-brass/25"}`} />
    </div>
  );

  return (
    <section
      data-hero-tone={tone}
      className={`relative overflow-hidden ${background} ${dark ? "on-dark grain text-on-dark" : "text-ink"}`}
      aria-labelledby="service-hero-title"
    >
      <div className="container-x pb-20 pt-[calc(var(--header-h)+3.5rem)] lg:pb-28 lg:pt-[calc(var(--header-h)+5rem)]">
        {layout === "centered" ? (
          <div className="grid gap-16">
            {Copy}
            <div className="mx-auto w-full max-w-md">{Art}</div>
          </div>
        ) : (
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
            <div className={`lg:col-span-6 ${layout === "art-left" ? "lg:order-2 lg:col-start-7" : ""}`}>{Copy}</div>
            <div className={`lg:col-span-5 ${layout === "art-left" ? "lg:order-1 lg:col-start-1" : "lg:col-start-8"}`}>{Art}</div>
          </div>
        )}
      </div>
    </section>
  );
}
