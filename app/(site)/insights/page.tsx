import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCover } from "@/components/art/ArticleCover";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { articles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Insights",
  description: "Articles on numerology, Reiki, career decisions and healthy communication — clear, grounded and written for reflection.",
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
  const [featured, ...rest] = articles;
  return (
    <>
      <section data-hero-tone="light" className="bg-porcelain" aria-labelledby="insights-page-title">
        <div className="container-x pb-14 pt-[calc(var(--header-h)+4rem)] lg:pt-[calc(var(--header-h)+6rem)]">
          <Eyebrow>Insights &amp; Journal</Eyebrow>
          <h1 id="insights-page-title" className="display-xl mt-6 max-w-[14ch]">
            Notes for the <span className="italic text-brass-deep">curious.</span>
          </h1>
          <p className="lede mt-8 max-w-2xl text-ink-soft">
            Grounded introductions and reflective prompts. Every article is written to inform, not to make promises.
          </p>
        </div>
      </section>

      <section aria-label="Articles" className="bg-porcelain pb-[var(--section-y)]">
        <div className="container-x">
          <Reveal as="article">
            <Link href={`/insights/${featured.slug}`} className="group grid items-center gap-10 border-t border-line-light pt-12 lg:grid-cols-12">
              <ArticleCover article={featured} className="aspect-[16/10] rounded-sm lg:col-span-7" sizes="(min-width:1024px) 58vw, 100vw" />
              <div className="lg:col-span-5">
                <p className="eyebrow text-brass-deep">
                  {featured.category} · {featured.readingMinutes} min read
                </p>
                <h2 className="display-md mt-4 transition-colors group-hover:text-brass-deep">{featured.title}</h2>
                <p className="mt-5 text-ink-soft">{featured.excerpt}</p>
              </div>
            </Link>
          </Reveal>

          <div className="mt-20 grid gap-x-12 gap-y-16 md:grid-cols-2">
            {rest.map((a, i) => (
              <Reveal as="article" key={a.slug} delay={(i % 2) * 0.08}>
                <Link href={`/insights/${a.slug}`} className="group block">
                  <ArticleCover article={a} className="aspect-[3/2] rounded-sm" sizes="(min-width:768px) 45vw, 100vw" />
                  <p className="eyebrow mt-6 text-brass-deep">
                    {a.category} · {a.readingMinutes} min read
                  </p>
                  <h2 className="display-sm mt-3 transition-colors group-hover:text-brass-deep">{a.title}</h2>
                  <p className="mt-3 text-ink-soft">{a.excerpt}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
