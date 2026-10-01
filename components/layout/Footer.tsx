import Link from "next/link";
import { mainNav, site } from "@/lib/site";
import { services } from "@/lib/services";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const { contact, social } = site;
  const hasContact = contact.email || contact.phone || contact.address;

  return (
    <footer className="on-dark relative overflow-hidden bg-espresso text-on-dark">
      {/* Arch horizon line echoing the logo */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 w-[140%] max-w-none -translate-x-1/2 text-brass opacity-25"
        viewBox="0 0 1400 260"
        fill="none"
      >
        <path d="M60 260 A640 240 0 0 1 1340 260" stroke="currentColor" strokeWidth="1" />
      </svg>

      <div className="container-x relative grid gap-14 pb-10 pt-24 md:grid-cols-12 md:pt-32">
        <div className="md:col-span-4">
          <Logo tone="dark" className="h-auto w-[132px]" sizes="132px" />
          <p className="mt-8 max-w-xs text-[0.95rem] leading-relaxed text-on-dark-soft">
            Personal guidance through numerology, Reiki, career and relationship conversations — with{" "}
            {site.practitioner.name}.
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-10 md:col-span-5 md:grid-cols-2">
          <div>
            <p className="eyebrow text-champagne">Explore</p>
            <ul className="mt-5 grid gap-3 text-[0.95rem]">
              {mainNav.map((n) => (
                <li key={n.href}>
                  <Link className="link-underline text-on-dark-soft hover:text-on-dark" href={n.href}>
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link className="link-underline text-on-dark-soft hover:text-on-dark" href="/book-session">
                  Book a Session
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-champagne">Services</p>
            <ul className="mt-5 grid gap-3 text-[0.95rem]">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link className="link-underline text-on-dark-soft hover:text-on-dark" href={`/services/${s.slug}`}>
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="md:col-span-3">
          <p className="eyebrow text-champagne">Contact</p>
          {hasContact ? (
            <ul className="mt-5 grid gap-3 text-[0.95rem] text-on-dark-soft">
              {contact.email && (
                <li>
                  <a className="link-underline hover:text-on-dark" href={`mailto:${contact.email}`}>
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.phone && (
                <li>
                  <a className="link-underline hover:text-on-dark" href={`tel:${contact.phone.replace(/\s/g, "")}`}>
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact.address && <li className="whitespace-pre-line">{contact.address}</li>}
            </ul>
          ) : (
            <p className="mt-5 text-[0.95rem] leading-relaxed text-on-dark-soft">
              The quickest way to reach us is the{" "}
              <Link href="/contact" className="text-on-dark underline decoration-brass underline-offset-4">
                contact form
              </Link>
              .
            </p>
          )}
          {social.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-5 text-sm">
              {social.map((s) => (
                <li key={s.href}>
                  <a className="link-underline text-on-dark-soft hover:text-on-dark" href={s.href} rel="noopener noreferrer" target="_blank">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="container-x relative">
        <div className="flex flex-col gap-4 border-t border-line-dark py-8 text-sm text-on-dark-soft md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Powerhouse Numerology. All rights reserved.</p>
          <ul className="flex gap-6">
            <li>
              <Link className="link-underline hover:text-on-dark" href="/privacy">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link className="link-underline hover:text-on-dark" href="/terms">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
        <p className="pb-10 text-xs leading-relaxed text-on-dark-soft/80">
          Numerology and Reiki are complementary, reflective practices. They do not predict outcomes and are not a substitute
          for medical, psychological, legal or financial advice.
        </p>
      </div>
    </footer>
  );
}
