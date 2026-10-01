import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

/** Editorial two-column section: heading rail on the left, content on the right. */
export function Section({
  eyebrow,
  title,
  children,
  className = "bg-porcelain",
  id,
}: {
  eyebrow: string;
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section id={id} aria-labelledby={headingId} className={className}>
      <div className="container-x section-y grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id={headingId} className="display-md mt-6 text-balance">
            {title}
          </h2>
        </Reveal>
        <Reveal delay={0.08} className="lg:col-span-7 lg:col-start-6">
          {children}
        </Reveal>
      </div>
    </section>
  );
}

export function Bullets({ items, className = "" }: { items: React.ReactNode[]; className?: string }) {
  return (
    <ul className={`grid gap-4 ${className}`}>
      {items.map((item, i) => (
        <li key={i} className="grid grid-cols-[1.5rem_1fr] gap-3 text-ink-soft">
          <span aria-hidden="true" className="mt-[0.8em] h-px w-4 bg-brass" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Note({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <aside className={`border-l-2 border-brass bg-ivory/70 px-6 py-5 ${className}`}>
      <p className="font-semibold">{title}</p>
      <div className="mt-2 text-[0.95rem] text-ink-soft">{children}</div>
    </aside>
  );
}
