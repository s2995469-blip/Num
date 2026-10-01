"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { HeroFallback } from "@/components/3d/HeroFallback";
import { useMediaQuery } from "@/lib/use-media-query";

const HeroExperience = dynamic(() => import("@/components/3d/HeroExperience"), { ssr: false });

type Tier = "pending" | "none" | "lite" | "high";

function detectTier(): Exclude<Tier, "pending"> {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    if (!gl) return "none";
  } catch {
    return "none";
  }
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return "none";
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) return "none";
  const small = window.innerWidth < 768;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const fewCores = (nav.hardwareConcurrency ?? 8) <= 4;
  return small || coarse || fewCores ? "lite" : "high";
}

/**
 * Owns the hero's visual layer: picks a device tier, lazy-loads the WebGL
 * scene after first paint, cross-fades it over the static fallback, pauses it
 * off-screen, and offers an optional "Explore the Experience" mode.
 */
export function HeroStage({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [tier, setTier] = useState<Tier>("pending");
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [exploring, setExploring] = useState(false);

  useEffect(() => {
    // Let text and layout paint first; then decide and start loading 3D.
    const start = () => setTier(detectTier());
    const hasIdle = typeof window.requestIdleCallback === "function";
    const id = hasIdle ? window.requestIdleCallback(start, { timeout: 1200 }) : window.setTimeout(start, 300);
    return () => {
      if (hasIdle) window.cancelIdleCallback(id);
      else clearTimeout(id);
    };
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.02 });
    io.observe(el);
    const onVis = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    if (!exploring) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setExploring(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [exploring]);

  const onReady = useCallback(() => setReady(true), []);
  const onFail = useCallback(() => setFailed(true), []);

  const live = (tier === "lite" || tier === "high") && !failed;
  const showScene = live && ready;

  return (
    <section
      ref={sectionRef}
      id="top"
      data-hero-tone="dark"
      aria-label="Introduction"
      className="on-dark grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-espresso text-on-dark"
    >
      <div className="absolute inset-0 -z-10">
        <HeroFallback />
        {live && (
          <div
            className="absolute inset-0 transition-opacity duration-[1800ms] ease-out"
            style={{ opacity: showScene ? 1 : 0 }}
          >
            <HeroExperience
              quality={tier === "high" ? "high" : "lite"}
              reducedMotion={reducedMotion}
              active={inView && pageVisible}
              exploring={exploring}
              pointer={finePointer}
              onReady={onReady}
              onFail={onFail}
            />
          </div>
        )}
        {/* Legibility veils: left on desktop, bottom on small screens */}
        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${exploring ? "opacity-0" : "opacity-100"}`}
        >
          <div className="absolute inset-y-0 left-0 hidden w-[64%] bg-gradient-to-r from-espresso/90 via-espresso/60 to-transparent lg:block" />
          <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-espresso via-espresso/80 to-transparent lg:h-[38%] lg:from-espresso/80 lg:via-espresso/20" />
        </div>
      </div>

      <div
        className={`flex flex-1 flex-col transition-[opacity,transform] duration-700 ${
          exploring ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100"
        }`}
        aria-hidden={exploring || undefined}
        inert={exploring || undefined}
      >
        {children}
      </div>

      {/* Bottom bar: scroll cue + optional explore control */}
      <div className="container-x relative flex items-end justify-between pb-8 lg:pb-10">
        <a
          href="#services"
          className={`group hidden items-center gap-4 text-sm text-on-dark-soft sm:flex transition-opacity hover:text-on-dark ${exploring ? "opacity-0" : ""}`}
          tabIndex={exploring ? -1 : undefined}
        >
          <span className="relative block h-12 w-px overflow-hidden bg-on-dark/15">
            <span className="scroll-cue-line absolute inset-0 bg-champagne" />
          </span>
          Scroll to explore
        </a>

        {showScene && (
          <button
            type="button"
            onClick={() => setExploring((v) => !v)}
            aria-pressed={exploring}
            className="ml-auto hidden min-h-11 items-center gap-3 rounded-full px-4 md:flex text-sm text-on-dark-soft ring-1 ring-on-dark/20 backdrop-blur-sm transition-colors hover:text-on-dark hover:ring-on-dark/40"
          >
            <span aria-hidden="true" className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-champagne" />
            </span>
            {exploring ? "Return to the page" : "Explore the Experience"}
          </button>
        )}
      </div>
      {exploring && (
        <p className="sr-only" role="status">
          Exploring the scene. Drag to look around; press Escape or the button to return.
        </p>
      )}
    </section>
  );
}
