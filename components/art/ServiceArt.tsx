import type { ServiceSlug } from "@/lib/services";

/**
 * Four art-directed service visuals sharing one lighting language: a warm
 * source from upper-right, ivory stone, brushed-brass line work. Each element
 * eases slightly when its parent `.group` is hovered/focused or `active`.
 */
type ArtProps = { active?: boolean; className?: string; idPrefix?: string };

const T = "transition-transform duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)]";

export function NumerologyArt({ active, className, idPrefix = "num" }: ArtProps) {
  const id = (s: string) => `${idPrefix}-${s}`;
  return (
    <svg viewBox="0 0 600 700" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={id("glow")} cx="0.62" cy="0.38" r="0.6">
          <stop offset="0" stopColor="#dcc18b" stopOpacity="0.35" />
          <stop offset="1" stopColor="#dcc18b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("sphere")} cx="0.36" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#faf5ea" />
          <stop offset="0.5" stopColor="#e2d5be" />
          <stop offset="1" stopColor="#7c6b55" />
        </radialGradient>
      </defs>
      <rect width="600" height="700" fill={`url(#${id("glow")})`} />
      <g fill="none" stroke="#b4935a" strokeWidth="1">
        {[250, 205, 160].map((r, i) => (
          <circle key={r} cx="300" cy="340" r={r} strokeOpacity={0.18 + i * 0.12} />
        ))}
      </g>
      <g className={`${T} origin-[300px_340px] ${active ? "rotate-[14deg]" : ""} group-hover:rotate-[14deg] group-focus-visible:rotate-[14deg]`}>
        <ellipse cx="300" cy="340" rx="232" ry="66" fill="none" stroke="#b4935a" strokeWidth="1.3" transform="rotate(-18 300 340)" />
        <circle cx="520" cy="268" r="6" fill="#b4935a" />
      </g>
      <circle cx="300" cy="340" r="118" fill={`url(#${id("sphere")})`} />
      <g fontFamily="Cormorant Garamond, Georgia, serif" fill="#9c8661" textAnchor="middle">
        {Array.from({ length: 9 }, (_, i) => {
          const a = (i / 9) * Math.PI * 2 - Math.PI / 2;
          return (
            <text key={i} x={300 + Math.cos(a) * 92} y={348 + Math.sin(a) * 92} fontSize="18" fillOpacity="0.85">
              {i + 1}
            </text>
          );
        })}
        <text x="300" y="378" fontSize="96" fillOpacity="0.9">
          7
        </text>
      </g>
      <circle cx="300" cy="340" r="66" fill="none" stroke="#9c8661" strokeOpacity="0.5" />
      <ellipse cx="300" cy="560" rx="150" ry="10" fill="#000" fillOpacity="0.22" />
    </svg>
  );
}

export function ReikiArt({ active, className, idPrefix = "rei" }: ArtProps) {
  const id = (s: string) => `${idPrefix}-${s}`;
  return (
    <svg viewBox="0 0 600 700" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={id("light")} cx="0.5" cy="0.42" r="0.5">
          <stop offset="0" stopColor="#ffe9c2" stopOpacity="0.9" />
          <stop offset="0.4" stopColor="#dcc18b" stopOpacity="0.35" />
          <stop offset="1" stopColor="#dcc18b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("stone")} x1="0.2" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#f6efe2" />
          <stop offset="0.6" stopColor="#cdbd9f" />
          <stop offset="1" stopColor="#6f604c" />
        </linearGradient>
      </defs>
      <circle
        cx="300"
        cy="300"
        r="260"
        fill={`url(#${id("light")})`}
        className={`${T} origin-[300px_300px] ${active ? "scale-110" : ""} group-hover:scale-110 group-focus-visible:scale-110`}
      />
      <g fill="none" stroke="#dcc18b">
        {[0, 1, 2, 3].map((i) => (
          <ellipse
            key={i}
            cx="300"
            cy={505 - i * 4}
            rx={120 + i * 46}
            ry={18 + i * 7}
            strokeOpacity={0.55 - i * 0.11}
            className={`${T} origin-[300px_505px] ${active ? "scale-105" : ""} group-hover:scale-105`}
          />
        ))}
      </g>
      {/* Standing sculptural form — a smooth, softly lit stone */}
      <path
        d="M300 170 C368 170 392 260 388 350 C384 440 360 500 300 500 C240 500 216 440 212 350 C208 260 232 170 300 170 Z"
        fill={`url(#${id("stone")})`}
      />
      <path
        d="M300 170 C368 170 392 260 388 350"
        fill="none"
        stroke="#ffe9c2"
        strokeOpacity="0.7"
        strokeWidth="2"
      />
      <ellipse cx="300" cy="506" rx="96" ry="9" fill="#000" fillOpacity="0.28" />
    </svg>
  );
}

export function CareerArt({ active, className, idPrefix = "car" }: ArtProps) {
  const id = (s: string) => `${idPrefix}-${s}`;
  const arches = [0, 1, 2, 3, 4];
  return (
    <svg viewBox="0 0 600 700" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id("end")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4dcae" />
          <stop offset="1" stopColor="#ffefcf" />
        </linearGradient>
        <linearGradient id={id("path")} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#d8c7ac" stopOpacity="0.55" />
          <stop offset="1" stopColor="#f4dcae" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {/* Illuminated far opening */}
      <path d="M282 360 V330 A18 18 0 0 1 318 330 V360 Z" fill={`url(#${id("end")})`} />
      {/* Receding arches — one-point perspective */}
      <g fill="none" stroke="#d8c7ac">
        {arches.map((i) => {
          const s = 1 + i * 0.9;
          const w = 40 * s;
          const h = 60 * s;
          const base = 360 + i * 46;
          return (
            <path
              key={i}
              d={`M${300 - w} ${base} V${base - h + w} A${w} ${w} 0 0 1 ${300 + w} ${base - h + w} V${base}`}
              strokeOpacity={0.9 - i * 0.12}
              strokeWidth={1 + i * 0.35}
            />
          );
        })}
      </g>
      {/* Pathway */}
      <path d="M296 360 L304 360 L470 700 L130 700 Z" fill={`url(#${id("path")})`} fillOpacity="0.35" />
      <g stroke="#b4935a" strokeOpacity="0.5">
        {[400, 450, 520, 610].map((y, i) => {
          const half = 4 + (y - 360) * 0.5;
          return <line key={i} x1={300 - half} y1={y} x2={300 + half} y2={y} />;
        })}
      </g>
      {/* Walker — a single brass bead advancing on hover */}
      <circle
        cx="300"
        cy="560"
        r="7"
        fill="#b4935a"
        className={`${T} ${active ? "-translate-y-[90px] scale-75" : ""} group-hover:-translate-y-[90px] group-hover:scale-75 group-focus-visible:-translate-y-[90px]`}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
    </svg>
  );
}

export function RelationshipArt({ active, className, idPrefix = "rel" }: ArtProps) {
  const id = (s: string) => `${idPrefix}-${s}`;
  return (
    <svg viewBox="0 0 600 700" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id("a")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f7f1e5" />
          <stop offset="1" stopColor="#a8977c" />
        </linearGradient>
        <linearGradient id={id("b")} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8e5ed" />
          <stop offset="1" stopColor="#8d8376" />
        </linearGradient>
        <radialGradient id={id("bridge")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffe9c2" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ffe9c2" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Light between the two forms */}
      <ellipse cx="300" cy="350" rx="70" ry="120" fill={`url(#${id("bridge")})`} />
      {/* Two complementary halves of an arch, leaning toward each other */}
      <g className={`${T} ${active ? "translate-x-[10px]" : ""} group-hover:translate-x-[10px] group-focus-visible:translate-x-[10px]`}>
        <path d="M150 520 V330 A130 130 0 0 1 280 200 V520 Z" fill={`url(#${id("a")})`} />
      </g>
      <g className={`${T} ${active ? "-translate-x-[10px]" : ""} group-hover:-translate-x-[10px] group-focus-visible:-translate-x-[10px]`}>
        <path d="M450 520 V330 A130 130 0 0 0 320 200 V520 Z" fill={`url(#${id("b")})`} />
      </g>
      <path d="M210 230 Q300 150 390 230" fill="none" stroke="#b4935a" strokeWidth="1.3" strokeDasharray="2 6" strokeLinecap="round" />
      <ellipse cx="300" cy="526" rx="190" ry="10" fill="#000" fillOpacity="0.25" />
    </svg>
  );
}

export function ServiceArt({ slug, ...props }: ArtProps & { slug: ServiceSlug }) {
  switch (slug) {
    case "numerology":
      return <NumerologyArt {...props} />;
    case "reiki-healing":
      return <ReikiArt {...props} />;
    case "career-counselling":
      return <CareerArt {...props} />;
    case "relationship-counselling":
      return <RelationshipArt {...props} />;
  }
}
