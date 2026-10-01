"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { mainNav } from "@/lib/site";
import { services } from "@/lib/services";
import { Logo } from "@/components/ui/Logo";
import { Arrow } from "@/components/ui/Arrow";

export function MobileNavigation({
  open,
  onClose,
  pathname,
  isActive,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
  isActive: (pathname: string, href: string) => boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-navigation"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      hidden={!open}
      className="on-dark fixed inset-0 z-[60] overflow-y-auto bg-espresso text-on-dark lg:hidden"
    >
      <div className="container-x flex h-[var(--header-h)] items-center justify-between">
        <Link href="/" onClick={onClose} aria-label="Powerhouse Numerology — home">
          <Logo tone="dark" className="h-auto w-[66px]" />
        </Link>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full"
          aria-label="Close menu"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>
      </div>

      <nav aria-label="Mobile" className="container-x pb-12 pt-6">
        <ul className="border-t border-line-dark">
          {mainNav.map((item) => (
            <li key={item.href} className="border-b border-line-dark">
              <Link
                href={item.href}
                onClick={onClose}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className="flex items-center justify-between py-5 font-display text-[2.1rem] leading-none aria-[current=page]:text-champagne"
              >
                {item.label}
                <Arrow className="opacity-50" />
              </Link>
            </li>
          ))}
        </ul>

        <p className="eyebrow mt-10 text-on-dark-soft">Services</p>
        <ul className="mt-4 grid gap-3">
          {services.map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} onClick={onClose} className="flex gap-4 py-1 text-on-dark-soft hover:text-on-dark">
                <span className="w-6 text-sm text-champagne">{s.index}</span>
                {s.title}
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/book-session" onClick={onClose} className="btn btn-light mt-12 w-full">
          Book a Session <Arrow />
        </Link>
      </nav>
    </div>
  );
}
