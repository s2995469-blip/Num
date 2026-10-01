import Image from "next/image";
import onDark from "@/public/logo/powerhouse-logo-on-dark.png";
import onLight from "@/public/logo/powerhouse-logo-on-light.png";

/**
 * The client's original logo artwork (see scripts/process-logo.mjs).
 * `tone` is the background it sits on.
 */
export function Logo({
  tone,
  className,
  priority,
  sizes = "96px",
}: {
  tone: "dark" | "light";
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      src={tone === "dark" ? onDark : onLight}
      alt="Powerhouse Numerology"
      className={className}
      priority={priority}
      sizes={sizes}
      quality={100}
    />
  );
}
