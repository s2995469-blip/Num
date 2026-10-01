import type { ReactNode } from "react";

export function Eyebrow({ children, tone = "light", className = "" }: { children: ReactNode; tone?: "light" | "dark"; className?: string }) {
  return (
    <p className={`eyebrow flex items-center gap-3 ${tone === "dark" ? "text-champagne" : "text-brass-deep"} ${className}`}>
      <span aria-hidden="true" className="inline-block h-px w-8 bg-current opacity-70" />
      {children}
    </p>
  );
}
