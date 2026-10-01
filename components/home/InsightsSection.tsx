import Link from "next/link";
import { articles } from "@/lib/articles";
import { ArticleCover } from "@/components/art/ArticleCover";
import { Arrow } from "@/components/ui/Arrow";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

export function InsightsSection() {
  const [featured, ...rest] = articles;
  return (
    <section aria-labelledby="insights-title" className="bg-porcelain">
      <div className="container-x section-y">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <Eyebrow>Insights &amp; Journal</Eyebrow>
            <h2 id="insights-title" className="display-lg mt-6">
              Notes for the curious.
            </h2>
          </Reveal>
          <Link href="/insights" className="link-arrow group inline-flex min-h-11 items-center gap-3 font-semibold">
            <span className="link-underline">All articles</span> <Arrow />
          </Link>
        </div>

        <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-12">
          <Reveal as="article" className="lg:col-span-7">
            <Link href={`/insights/${featured.slug}`} className="group block">
              <ArticleCover article={featured} className="aspect-[16/10] rounded-sm" sizes="(min-width:1024px) 55vw, 100vw" />
              <p className="eyebrow mt-8 text-brass-deep">
                {featured.category} · {featured.readingMinutes} min read
              </p>
              <h3 className="display-md mt-4 max-w-[22ch] transition-colors group-hover:text-brass-deep">{featured.title}</h3>
              <p className="mt-4 max-w-xl text-ink-soft">{featured.excerpt}</p>
            </Link>
          </Reveal>

          <ol className="lg:col-span-5">
            {rest.map((a, i) => (
              <Reveal as="li" key={a.slug} delay={i * 0.06} className="border-t border-line-light last:border-b">
                <Link href={`/insights/${a.slug}`} className="group grid grid-cols-[1fr_auto] items-center gap-6 py-7">
                  <span>
                    <span className="eyebrow block text-brass-deep">{a.category}</span>
                    <span className="mt-2 block font-display text-[1.6rem] leading-tight transition-colors group-hover:text-brass-deep">
                      {a.title}
                    </span>
                  </span>
                  <Arrow className="text-brass-deep" />
                </Link>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
