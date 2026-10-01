import Image from "next/image";
import { site } from "@/lib/site";

/**
 * Shows the real portrait once supplied (site.practitioner.portrait).
 * Until then: an intentional monogram in the arch frame — never a stand-in
 * photograph of someone else.
 */
export function PractitionerPortrait({ className = "", priority }: { className?: string; priority?: boolean }) {
  const { name, portrait } = site.practitioner;
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .join("");

  return (
    <figure className={className}>
      <div className="arch-mask relative aspect-[4/5] overflow-hidden bg-sandstone">
        {portrait ? (
          <Image
            src={portrait}
            alt={`Portrait of ${name}`}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_20%,#f3e6cc_0%,#d8c7ac_55%,#b9a487_100%)]">
            <svg aria-hidden="true" viewBox="0 0 400 500" className="absolute inset-0 h-full w-full">
              <g fill="none" stroke="#7d6234" strokeOpacity="0.35">
                <path d="M60 500 V200 A140 140 0 0 1 340 200 V500" />
                <path d="M90 500 V205 A110 110 0 0 1 310 205 V500" strokeOpacity="0.2" />
              </g>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                aria-hidden="true"
                className="font-display text-[clamp(5rem,12vw,9rem)] leading-none tracking-[-0.04em] text-espresso/80"
              >
                {initials}
              </span>
            </div>
          </div>
        )}
      </div>
      <figcaption className="mt-5 flex items-center gap-3 text-sm text-ink-soft">
        <span aria-hidden="true" className="h-px w-8 bg-brass" />
        {name}
      </figcaption>
    </figure>
  );
}
