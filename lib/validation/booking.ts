import { z } from "zod";
import { serviceSlugs } from "../services";
import { site, type SessionFormat } from "../site";

export const timeWindows = [
  { value: "morning", label: "Morning (before 12:00)" },
  { value: "afternoon", label: "Afternoon (12:00–17:00)" },
  { value: "evening", label: "Evening (after 17:00)" },
  { value: "flexible", label: "I'm flexible" },
] as const;

export type TimeWindow = (typeof timeWindows)[number]["value"];

const timeWindowValues = timeWindows.map((t) => t.value) as [TimeWindow, ...TimeWindow[]];

/** YYYY-MM-DD in the visitor's calendar; compared as plain dates. */
function todayISO(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export const minBookingDate = () => todayISO(1);
export const maxBookingDate = () => todayISO(365);

const name = z
  .string({ error: "Please enter your name." })
  .trim()
  .min(2, "Please enter your full name.")
  .max(120, "Please keep your name under 120 characters.")
  .regex(/^[^<>{}\[\]\\]+$/, "Please use letters, spaces and common punctuation only.");

const email = z
  .string({ error: "Please enter your email address." })
  .trim()
  .toLowerCase()
  .max(254, "That email address is too long.")
  .pipe(z.email("Please enter a valid email address."));

const phone = z
  .string()
  .trim()
  .max(32, "Please keep the phone number under 32 characters.")
  .regex(/^[+()\d\s.-]*$/, "Please use digits, spaces and + ( ) - only.")
  .refine((v) => v === "" || v.replace(/\D/g, "").length >= 7, "That phone number looks too short.")
  .transform((v) => (v === "" ? null : v));

const message = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Please keep your message under ${max} characters.`)
    .transform((v) => (v === "" ? null : v));

export const bookingSchema = z
  .object({
    name,
    email,
    phone: phone.optional().default(""),
    service: z.enum(serviceSlugs, { error: "Please choose a service." }),
    preferredDate: z
      .string({ error: "Please choose a preferred date." })
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a preferred date.")
      .refine((v) => !Number.isNaN(Date.parse(v)), "Please choose a valid date.")
      .refine((v) => v >= todayISO(0), "Please choose a date in the future.")
      .refine((v) => v <= maxBookingDate(), "Please choose a date within the next 12 months."),
    preferredTime: z.enum(timeWindowValues, { error: "Please choose a time window." }),
    sessionFormat: z.string().optional().default(""),
    message: message(2000).optional().default(""),
    privacyConsent: z.literal(true, {
      error: "Please confirm you have read the privacy policy.",
    }),
    idempotencyKey: z.uuid("Something went wrong. Please refresh the page and try again."),
    /** Honeypot — must stay empty. */
    company: z.string().max(0).optional().default(""),
    /** Milliseconds the form was open before submit (spam heuristic). */
    elapsedMs: z.coerce.number().int().nonnegative().optional(),
  })
  .superRefine((data, ctx) => {
    const offered = site.sessionFormats as readonly SessionFormat[];
    if (offered.length === 0) {
      if (data.sessionFormat) {
        ctx.addIssue({ code: "custom", path: ["sessionFormat"], message: "Session format is agreed on confirmation." });
      }
      return;
    }
    if (!offered.includes(data.sessionFormat as SessionFormat)) {
      ctx.addIssue({ code: "custom", path: ["sessionFormat"], message: "Please choose a session format." });
    }
  });

export type BookingInput = z.input<typeof bookingSchema>;
export type BookingData = z.output<typeof bookingSchema>;

export const contactSchema = z.object({
  name,
  email,
  subject: z
    .string({ error: "Please add a subject." })
    .trim()
    .min(2, "Please add a subject.")
    .max(160, "Please keep the subject under 160 characters."),
  message: z
    .string({ error: "Please write a message." })
    .trim()
    .min(10, "Please write a little more (at least 10 characters).")
    .max(4000, "Please keep your message under 4000 characters."),
  privacyConsent: z.literal(true, { error: "Please confirm you have read the privacy policy." }),
  idempotencyKey: z.uuid("Something went wrong. Please refresh the page and try again."),
  company: z.string().max(0).optional().default(""),
  elapsedMs: z.coerce.number().int().nonnegative().optional(),
});

export type ContactData = z.output<typeof contactSchema>;

/** Flattens Zod issues into { field: firstMessage }. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
