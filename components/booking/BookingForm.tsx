"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useClientValue } from "@/lib/use-media-query";
import { services, type ServiceSlug } from "@/lib/services";
import { sessionFormatLabels, site } from "@/lib/site";
import { bookingSchema, fieldErrors, maxBookingDate, minBookingDate, timeWindows } from "@/lib/validation/booking";
import { Arrow } from "@/components/ui/Arrow";
import { describedBy, Field } from "./Field";
import { useSubmission } from "./useSubmission";

type Values = {
  name: string;
  email: string;
  phone: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  sessionFormat: string;
  message: string;
  privacyConsent: boolean;
  company: string;
};

const FIELD_ORDER: (keyof Values)[] = [
  "name",
  "email",
  "phone",
  "service",
  "preferredDate",
  "preferredTime",
  "sessionFormat",
  "message",
  "privacyConsent",
];

export function BookingForm({ initialService }: { initialService?: ServiceSlug }) {
  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    phone: "",
    service: initialService ?? "",
    preferredDate: "",
    preferredTime: "",
    sessionFormat: "",
    message: "",
    privacyConsent: false,
    company: "",
  });
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  // Computed on the client so the date picker reflects the visitor's own "today".
  const minDate = useClientValue(minBookingDate);
  const maxDate = useClientValue(maxBookingDate);
  const { status, message, serverFieldErrors, result, submit } = useSubmission<{ reference: string | null; replayed?: boolean }>(
    "/api/bookings",
  );
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
    if (status === "error" || status === "duplicate") statusRef.current?.focus();
  }, [status]);

  const errors = { ...serverFieldErrors, ...clientErrors };
  const formats = site.sessionFormats;

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (clientErrors[key])
      setClientErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload = { ...values };
    // The server owns the real keys; validate the rest here for instant feedback.
    const parsed = bookingSchema.safeParse({ ...payload, idempotencyKey: crypto.randomUUID() });
    if (!parsed.success) {
      const errs = fieldErrors(parsed.error);
      setClientErrors(errs);
      const first = FIELD_ORDER.find((k) => errs[k]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setClientErrors({});
    void submit(payload);
  };

  if (status === "success") {
    const svc = services.find((s) => s.slug === values.service);
    return (
      <div className="rounded-sm bg-ivory p-8 md:p-12" role="status">
        <p className="eyebrow text-brass-deep">Enquiry received</p>
        <h2 ref={successRef} tabIndex={-1} className="display-md mt-4 outline-none">
          Thank you, {values.name.split(" ")[0]}.
        </h2>
        <p className="lede mt-6 text-ink-soft">
          Your request for <strong className="text-ink">{svc?.title}</strong> has been received
          {result?.reference ? (
            <>
              {" "}
              — your reference is <strong className="whitespace-nowrap text-ink">{result.reference}</strong>
            </>
          ) : null}
          .
        </p>
        <div className="mt-8 border-l-2 border-brass pl-5 text-ink-soft">
          <p>
            <strong className="text-ink">This is an enquiry, not yet a confirmed appointment.</strong> {site.practitioner.name}{" "}
            will review your preferred date and contact you at <strong className="text-ink">{values.email}</strong> to confirm
            a time and explain the next steps.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/insights" className="btn btn-primary">
            Read the journal <Arrow />
          </Link>
          <Link href="/" className="btn btn-ghost">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-describedby="booking-required-note" className="grid gap-8">
      <p id="booking-required-note" className="text-sm text-ink-soft">
        All fields are required unless marked optional.
      </p>

      <div ref={statusRef} tabIndex={-1} aria-live="polite" className="outline-none">
        {(status === "error" || status === "duplicate") && message && (
          <div
            className={`border-l-2 px-5 py-4 ${status === "duplicate" ? "border-brass bg-ivory" : "border-[#9b3b2e] bg-[#f6e9e4]"}`}
            role={status === "error" ? "alert" : undefined}
          >
            <p className="font-semibold">{status === "duplicate" ? "Already received" : "Your request wasn't sent"}</p>
            <p className="mt-1 text-[0.95rem] text-ink-soft">{message}</p>
          </div>
        )}
        {Object.keys(clientErrors).length > 0 && (
          <p className="field-error" role="alert">
            Please correct the {Object.keys(clientErrors).length === 1 ? "highlighted field" : "highlighted fields"} below.
          </p>
        )}
      </div>

      <fieldset className="grid gap-6">
        <legend className="display-sm mb-6">Your details</legend>
        <div className="grid gap-6 md:grid-cols-2">
          <Field id="name" label="Full name" error={errors.name}>
            <input
              id="name"
              name="name"
              autoComplete="name"
              className="field-input"
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={describedBy("name", errors.name)}
              required
            />
          </Field>
          <Field id="email" label="Email address" error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              className="field-input"
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={describedBy("email", errors.email)}
              required
            />
          </Field>
        </div>
        <Field id="phone" label="Phone number" optional hint="Only if you'd prefer a call back." error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className="field-input md:max-w-sm"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy("phone", errors.phone, true)}
          />
        </Field>
      </fieldset>

      <hr className="border-line-light" />

      <fieldset className="grid gap-6">
        <legend className="display-sm mb-6">Your session</legend>
        <Field id="service" label="Service" error={errors.service}>
          <select
            id="service"
            name="service"
            className="field-input"
            value={values.service}
            onChange={(e) => set("service", e.target.value)}
            aria-invalid={!!errors.service}
            aria-describedby={describedBy("service", errors.service)}
            required
          >
            <option value="">Choose a service…</option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid gap-6 md:grid-cols-2">
          <Field id="preferredDate" label="Preferred date" hint="A suggestion — the final time is agreed with you." error={errors.preferredDate}>
            <input
              id="preferredDate"
              name="preferredDate"
              type="date"
              min={minDate}
              max={maxDate}
              className="field-input"
              value={values.preferredDate}
              onChange={(e) => set("preferredDate", e.target.value)}
              aria-invalid={!!errors.preferredDate}
              aria-describedby={describedBy("preferredDate", errors.preferredDate, true)}
              required
            />
          </Field>
          <Field id="preferredTime" label="Preferred time window" error={errors.preferredTime}>
            <select
              id="preferredTime"
              name="preferredTime"
              className="field-input"
              value={values.preferredTime}
              onChange={(e) => set("preferredTime", e.target.value)}
              aria-invalid={!!errors.preferredTime}
              aria-describedby={describedBy("preferredTime", errors.preferredTime)}
              required
            >
              <option value="">Choose a time window…</option>
              {timeWindows.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {formats.length > 0 ? (
          <Field id="sessionFormat" label="Session format" error={errors.sessionFormat}>
            <select
              id="sessionFormat"
              name="sessionFormat"
              className="field-input"
              value={values.sessionFormat}
              onChange={(e) => set("sessionFormat", e.target.value)}
              aria-invalid={!!errors.sessionFormat}
              aria-describedby={describedBy("sessionFormat", errors.sessionFormat)}
              required
            >
              <option value="">Choose a format…</option>
              {formats.map((f) => (
                <option key={f} value={f}>
                  {sessionFormatLabels[f]}
                </option>
              ))}
            </select>
          </Field>
        ) : (
          <p className="text-[0.95rem] text-ink-soft">
            The session format (for example, in person or online) is agreed with you when your session is confirmed.
          </p>
        )}

        <Field
          id="message"
          label="Anything you'd like to share?"
          optional
          hint="Questions, preferences or a little context. Please don't include medical details or birth dates — anything needed later will be requested separately."
          error={errors.message}
        >
          <textarea
            id="message"
            name="message"
            rows={5}
            maxLength={2000}
            className="field-input resize-y"
            value={values.message}
            onChange={(e) => set("message", e.target.value)}
            aria-invalid={!!errors.message}
            aria-describedby={describedBy("message", errors.message, true)}
          />
        </Field>
      </fieldset>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={(e) => set("company", e.target.value)} />
      </div>

      <div className="border-t border-line-light pt-8">
        <div className="flex gap-4">
          <input
            id="privacyConsent"
            name="privacyConsent"
            type="checkbox"
            className="mt-1 h-5 w-5 shrink-0 accent-[var(--espresso)]"
            checked={values.privacyConsent}
            onChange={(e) => set("privacyConsent", e.target.checked)}
            aria-invalid={!!errors.privacyConsent}
            aria-describedby={describedBy("privacyConsent", errors.privacyConsent)}
            required
          />
          <label htmlFor="privacyConsent" className="text-[0.95rem] text-ink-soft">
            I have read the{" "}
            <Link href="/privacy" target="_blank" className="text-ink underline underline-offset-4">
              privacy policy
            </Link>{" "}
            and agree to my details being used to respond to this enquiry.
          </label>
        </div>
        {errors.privacyConsent && (
          <p id="privacyConsent-error" className="field-error pl-9">
            {errors.privacyConsent}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <button type="submit" className="btn btn-primary min-w-56 disabled:opacity-70" disabled={submitting} aria-disabled={submitting}>
          {submitting ? (
            <>
              <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border border-porcelain/40 border-t-porcelain" />
              Sending…
            </>
          ) : status === "error" ? (
            <>
              Try again <Arrow />
            </>
          ) : (
            <>
              Send enquiry <Arrow />
            </>
          )}
        </button>
        <p className="max-w-xs text-sm text-ink-soft">No payment is taken. Your session is confirmed personally.</p>
      </div>
    </form>
  );
}
