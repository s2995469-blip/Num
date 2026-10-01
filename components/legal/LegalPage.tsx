import { Eyebrow } from "@/components/ui/Eyebrow";

export function LegalPage({ eyebrow, title, updated, children }: { eyebrow: string; title: string; updated: string; children: React.ReactNode }) {
  return (
    <article data-hero-tone="light" className="bg-porcelain">
      <header className="container-x pt-[calc(var(--header-h)+4rem)] lg:pt-[calc(var(--header-h)+6rem)]">
        <div className="mx-auto max-w-[40rem]">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="display-lg mt-6">{title}</h1>
          <p className="mt-6 text-sm text-ink-soft">
            Last updated <time dateTime={updated}>{new Date(updated).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time>
          </p>
        </div>
      </header>
      <div className="container-x pb-[var(--section-y)] pt-12">
        <div className="prose-editorial mx-auto">{children}</div>
      </div>
    </article>
  );
}
