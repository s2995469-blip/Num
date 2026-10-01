import Image from "next/image";
import type { Article } from "@/lib/articles";

const tints: Record<Article["motif"], [string, string]> = {
  sphere: ["#efe6d6", "#d8c7ac"],
  rings: ["#e8e5ed", "#cfc8d6"],
  arch: ["#f3e6cc", "#dcc18b"],
  path: ["#e6e2d6", "#c9c0ad"],
  pair: ["#eee8dd", "#d6cbbb"],
};

/** Typographic/geometric cover for an article; uses coverImage when one is supplied. */
export function ArticleCover({ article, className = "", sizes = "50vw" }: { article: Article; className?: string; sizes?: string }) {
  if (article.coverImage) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image src={article.coverImage} alt="" fill sizes={sizes} className="object-cover" />
      </div>
    );
  }
  const [a, b] = tints[article.motif];
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: `linear-gradient(160deg, ${a}, ${b})` }}>
      <svg aria-hidden="true" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <g fill="none" stroke="#7d6234" strokeWidth="1">
          {article.motif === "sphere" && (
            <>
              <circle cx="200" cy="150" r="70" fill="#f7f4ed" fillOpacity="0.6" />
              <ellipse cx="200" cy="150" rx="130" ry="34" transform="rotate(-14 200 150)" strokeOpacity="0.7" />
              <circle cx="200" cy="150" r="100" strokeOpacity="0.25" />
            </>
          )}
          {article.motif === "rings" && [30, 55, 80, 105, 130].map((r, i) => <circle key={r} cx="200" cy="150" r={r} strokeOpacity={0.7 - i * 0.12} />)}
          {article.motif === "arch" && (
            <>
              <path d="M130 300 V150 A70 70 0 0 1 270 150 V300" fill="#f7f4ed" fillOpacity="0.5" />
              <circle cx="200" cy="170" r="26" fill="#dcc18b" fillOpacity="0.5" stroke="none" />
            </>
          )}
          {article.motif === "path" && (
            <>
              {[0, 1, 2, 3].map((i) => {
                const w = 20 + i * 34;
                const base = 150 + i * 40;
                return <path key={i} d={`M${200 - w} ${base} V${base - w * 0.6} A${w} ${w} 0 0 1 ${200 + w} ${base - w * 0.6} V${base}`} strokeOpacity={0.9 - i * 0.18} />;
              })}
              <path d="M196 150 L204 150 L290 300 L110 300 Z" fill="#f7f4ed" fillOpacity="0.45" stroke="none" />
            </>
          )}
          {article.motif === "pair" && (
            <>
              <path d="M110 240 V150 A70 70 0 0 1 180 80 V240 Z" fill="#f7f4ed" fillOpacity="0.6" />
              <path d="M290 240 V150 A70 70 0 0 0 220 80 V240 Z" fill="#e8e5ed" fillOpacity="0.8" />
              <path d="M150 95 Q200 50 250 95" strokeDasharray="2 5" />
            </>
          )}
        </g>
      </svg>
    </div>
  );
}
