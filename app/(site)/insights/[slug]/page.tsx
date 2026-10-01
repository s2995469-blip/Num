import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCover } from "@/components/art/ArticleCover";
import { Arrow } from "@/components/ui/Arrow";
import { articles, getArticle, type Block } from "@/lib/articles";
import { getService } from "@/lib/services";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/insights/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url: `/insights/${article.slug}`,
      publishedTime: article.published,
      section: article.category,
    },
  };
}

function renderBlock(b: Block, i: number) {
  switch (b.type) {
    case "p":
      return <p key={i}>{b.text}</p>;
    case "h2":
      return <h2 key={i}>{b.text}</h2>;
    case "h3":
      return <h3 key={i}>{b.text}</h3>;
    case "ul":
      return (
        <ul key={i}>
          {b.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      );
    case "quote":
      return <blockquote key={i}>{b.text}</blockquote>;
    case "note":
      return null;
  }
}

export default async function ArticlePage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const service = getService(article.relatedService)!;
  const note = article.body.find((b) => b.type === "note");
  const idx = articles.findIndex((a) => a.slug === article.slug);
  const next = articles[(idx + 1) % articles.length];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.published,
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: `${site.url}/logo/powerhouse-logo-original.png` } },
    mainEntityOfPage: `${site.url}/insights/${article.slug}`,
  };

  return (
    <article data-hero-tone="light" className="bg-porcelain">
      <header className="container-x pt-[calc(var(--header-h)+4rem)] lg:pt-[calc(var(--header-h)+6rem)]">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
          <Link href="/insights" className="link-underline">
            ← All insights
          </Link>
        </nav>
        <div className="mx-auto mt-12 max-w-3xl text-center">
          <p className="eyebrow text-brass-deep">
            {article.category} · {article.readingMinutes} min read
          </p>
          <h1 className="display-lg mt-6 text-balance">{article.title}</h1>
          <p className="lede mx-auto mt-6 max-w-2xl text-ink-soft">{article.excerpt}</p>
          <p className="mt-6 text-sm text-ink-soft">
            <time dateTime={article.published}>
              {new Date(article.published).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </time>
          </p>
        </div>
        <ArticleCover article={article} className="mx-auto mt-14 aspect-[21/9] max-w-6xl rounded-sm" sizes="(min-width:1200px) 1150px, 100vw" />
      </header>

      <div className="container-x py-20">
        <div className="prose-editorial mx-auto">{article.body.map(renderBlock)}</div>

        <aside className="mx-auto mt-20 max-w-[40rem] border-t border-line-light pt-10">
          {note && note.type === "note" && <p className="text-ink-soft">{note.text}</p>}
          <div className="mt-6 flex flex-wrap gap-4">
            <Link href={`/services/${service.slug}`} className="btn btn-primary">
              {service.cta} <Arrow />
            </Link>
            <Link href={`/book-session?service=${service.slug}`} className="btn btn-ghost">
              Book a Session
            </Link>
          </div>
        </aside>
      </div>

      <nav aria-label="Next article" className="bg-ivory">
        <Link href={`/insights/${next.slug}`} className="container-x group flex items-center justify-between gap-6 py-14">
          <span>
            <span className="eyebrow block text-brass-deep">Next article</span>
            <span className="display-sm mt-3 block transition-colors group-hover:text-brass-deep">{next.title}</span>
          </span>
          <Arrow className="shrink-0 text-brass-deep" />
        </Link>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </article>
  );
}
