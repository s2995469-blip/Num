import Link from "next/link";
import { Arrow } from "@/components/ui/Arrow";
import { HeroStage } from "./HeroStage";

export function HeroSection() {
  return (
    <HeroStage>
      <div className="container-x flex flex-1 flex-col justify-end pb-6 pt-[50svh] sm:pt-[46svh] lg:justify-center lg:pb-0 lg:pt-[calc(var(--header-h)+3rem)]">
        <div className="max-w-[40rem] lg:max-w-[48rem]">
          <p className="eyebrow hero-rise text-champagne" style={{ animationDelay: "0.1s" }}>
            Numerology · Reiki · Personal Guidance
          </p>
          <h1 className="display-xl hero-rise mt-6 text-balance text-on-dark" style={{ animationDelay: "0.2s" }}>
            Numbers Align.
            <br />
            <span className="italic text-champagne">Lives</span> Transform.
          </h1>
          <p className="lede hero-rise mt-7 max-w-[34rem] text-on-dark-soft" style={{ animationDelay: "0.35s" }}>
            Explore your path through personalised numerology, energy healing, career guidance, and relationship
            counselling.
          </p>
          <div className="hero-rise mt-10 flex flex-wrap items-center gap-x-8 gap-y-4" style={{ animationDelay: "0.5s" }}>
            <Link href="/book-session" className="btn btn-light">
              Begin Your Journey <Arrow />
            </Link>
            <Link href="#approach" className="link-arrow group inline-flex min-h-11 items-center gap-3 text-[0.95rem] font-semibold">
              <span className="link-underline">Explore Our Approach</span>
              <Arrow />
            </Link>
          </div>
          <p className="hero-rise mt-12 hidden text-sm text-on-dark-soft lg:block" style={{ animationDelay: "0.7s" }}>
            Personal guidance for a more intentional life.
          </p>
        </div>
      </div>
    </HeroStage>
  );
}
