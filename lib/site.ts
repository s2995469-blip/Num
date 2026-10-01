/**
 * Central business configuration.
 *
 * Anything set to `null` or `[]` here is client information that has NOT yet
 * been supplied. The UI hides or gracefully replaces these items rather than
 * inventing details. See README.md → "Client content still required".
 */

export const site = {
  name: "Powerhouse Numerology",
  shortName: "Powerhouse",
  tagline: "Discover yourself. Find clarity. Move forward with intention.",
  description:
    "Personalised numerology, Reiki healing, career guidance and relationship guidance with Saamruddhi Varkhede at Powerhouse Numerology.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),

  practitioner: {
    name: "Saamruddhi Varkhede",
    /** Path under /public once a real portrait is supplied, e.g. "/images/saamruddhi.jpg". */
    portrait: null as string | null,
    /** Short biography paragraphs, supplied and approved by the practitioner. */
    biography: [] as string[],
    /** Verified qualifications/certifications only. */
    credentials: [] as string[],
  },

  contact: {
    email: null as string | null,
    phone: null as string | null,
    /** Postal / studio address, if sessions are offered in person. */
    address: null as string | null,
    /** Business hours as display text, e.g. "Mon–Fri, 10:00–18:00 IST". */
    hours: null as string | null,
  },

  /** e.g. [{ label: "Instagram", href: "https://instagram.com/…" }] */
  social: [] as { label: string; href: string }[],

  /**
   * Session formats the practice actually offers. Leave empty until confirmed —
   * the booking form then hides the field and explains that the format will be
   * agreed when the session is confirmed.
   * Supported values: "in-person" | "online-video" | "phone" | "distance".
   */
  sessionFormats: [] as SessionFormat[],
} as const;

export type SessionFormat = "in-person" | "online-video" | "phone" | "distance";

export const sessionFormatLabels: Record<SessionFormat, string> = {
  "in-person": "In person",
  "online-video": "Online (video call)",
  phone: "Phone call",
  distance: "Distance session",
};

export const mainNav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
] as const;
