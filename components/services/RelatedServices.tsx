import Link from "next/link";
import { services, type ServiceSlug } from "@/lib/services";
import { Arrow } from "@/components/ui/Arrow";

export function RelatedServices({ current }: { current: ServiceSlug }) {
  const others = services.filter((s) => s.slug !== current);
  return (
    <nav aria-label="Other services" className="bg-ivory">
      <div className="container-x py-16">
        <p className="eyebrow text-brass-deep">Other ways to begin</p>
        <ul className="mt-6 grid md:grid-cols-3">
          {others.map((s) => (
            <li key={s.slug} className="border-t border-line-light md:border-l md:border-t-0 md:first:border-l-0 md:px-8 md:first:pl-0">
              <Link href={`/services/${s.slug}`} className="group flex items-center justify-between gap-4 py-6">
                <span>
                  <span className="text-sm text-brass-deep">{s.index}</span>
                  <span className="mt-1 block font-display text-[1.7rem] leading-tight">{s.title}</span>
                </span>
                <Arrow className="text-brass-deep" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
