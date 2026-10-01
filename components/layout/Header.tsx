"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mainNav } from "@/lib/site";
import { Logo } from "@/components/ui/Logo";
import { MobileNavigation } from "./MobileNavigation";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [heroTone, setHeroTone] = useState<"dark" | "light">("light");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Each page's hero declares the tone it renders on via data-hero-tone.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>("[data-hero-tone]");
      setHeroTone(el?.dataset.heroTone === "dark" ? "dark" : "light");
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const overHero = !scrolled && heroTone === "dark";
  const tone = overHero ? "dark" : "light";

  return (
    <>
      <a
        href="#main"
        className="sr-only-focusable fixed left-4 top-4 z-[70] rounded-full bg-espresso px-5 py-3 text-sm font-semibold text-porcelain"
      >
        Skip to content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-500 ${
          overHero
            ? "bg-transparent text-on-dark"
            : "bg-porcelain/90 text-ink shadow-[0_1px_0_var(--line-light)] backdrop-blur-md"
        } ${!scrolled && heroTone === "light" ? "shadow-none!" : ""}`}
      >
        <div
          className={`container-x flex items-center justify-between transition-[height] duration-500 ${
            scrolled ? "h-[4.5rem]" : "h-[var(--header-h)] lg:h-[6.5rem]"
          }`}
        >
          <Link href="/" className="relative z-10 -ml-1 shrink-0 rounded-sm" aria-label="Powerhouse Numerology — home">
            <Logo
              tone={tone}
              priority
              className={`h-auto transition-[width] duration-500 ${scrolled ? "w-[62px]" : "w-[72px] lg:w-[92px]"}`}
            />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-10">
              {mainNav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`link-underline pb-1 text-[0.95rem] font-medium tracking-wide transition-opacity ${
                        active ? "opacity-100" : "opacity-75 hover:opacity-100"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/book-session"
              className={`btn hidden min-h-11 px-6 text-sm sm:inline-flex ${overHero ? "btn-light" : "btn-primary"}`}
            >
              Book a Session
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen(true)}
            >
              <svg width="24" height="12" viewBox="0 0 24 12" aria-hidden="true">
                <path d="M0 1h24M6 11h18" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
          </div>
        </div>
        <div
          ref={progressRef}
          aria-hidden="true"
          className={`absolute bottom-0 left-0 h-px w-full origin-left bg-brass transition-opacity duration-500 ${
            scrolled ? "opacity-80" : "opacity-0"
          }`}
          style={{ transform: "scaleX(0)" }}
        />
      </header>

      <MobileNavigation
        open={menuOpen}
        onClose={() => {
          setMenuOpen(false);
          menuButtonRef.current?.focus();
        }}
        pathname={pathname}
        isActive={isActive}
      />
    </>
  );
}
