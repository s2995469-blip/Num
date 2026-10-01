"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { contactSchema, fieldErrors } from "@/lib/validation/booking";
import { Arrow } from "@/components/ui/Arrow";
import { describedBy, Field } from "./Field";
import { useSubmission } from "./useSubmission";

const ORDER = ["name", "email", "subject", "message", "privacyConsent"];

export function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", subject: "", message: "", privacyConsent: false, company: "" });
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const { status, message, serverFieldErrors, submit } = useSubmission("/api/contact");
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const errors = { ...serverFieldErrors, ...clientErrors };

  useEffect(() => {
    if (status === "success") doneRef.current?.focus();
  }, [status]);

  const set = (key: keyof typeof values, value: string | boolean) => {
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
    const parsed = contactSchema.safeParse({ ...values, idempotencyKey: crypto.randomUUID() });
    if (!parsed.success) {
      const errs = fieldErrors(parsed.error);
      setClientErrors(errs);
      const first = ORDER.find((k) => errs[k]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setClientErrors({});
    void submit(values);
  };

  if (status === "success") {
    return (
      <div className="rounded-sm bg-ivory p-8 md:p-10" role="status">
        <h2 ref={doneRef} tabIndex={-1} className="display-sm outline-none">
          Thank you — your message has been sent.
        </h2>
        <p className="mt-4 text-ink-soft">You&apos;ll receive a personal reply at {values.email}.</p>
      </div>
    );
  }

  const submitting = status === "submitting";
  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-6">
      <div aria-live="polite">
        {status === "error" && message && (
          <div role="alert" className="border-l-2 border-[#9b3b2e] bg-[#f6e9e4] px-5 py-4">
            <p className="font-semibold">Your message wasn&apos;t sent</p>
            <p className="mt-1 text-[0.95rem] text-ink-soft">{message}</p>
          </div>
        )}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Field id="c-name" label="Name" error={errors.name}>
          <input id="c-name" name="name" autoComplete="name" className="field-input" value={values.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={describedBy("c-name", errors.name)} required />
        </Field>
        <Field id="c-email" label="Email address" error={errors.email}>
          <input id="c-email" name="email" type="email" autoComplete="email" className="field-input" value={values.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={describedBy("c-email", errors.email)} required />
        </Field>
      </div>
      <Field id="c-subject" label="Subject" error={errors.subject}>
        <input id="c-subject" name="subject" className="field-input" value={values.subject} onChange={(e) => set("subject", e.target.value)} aria-invalid={!!errors.subject} aria-describedby={describedBy("c-subject", errors.subject)} required />
      </Field>
      <Field id="c-message" label="Message" error={errors.message}>
        <textarea id="c-message" name="message" rows={6} maxLength={4000} className="field-input resize-y" value={values.message} onChange={(e) => set("message", e.target.value)} aria-invalid={!!errors.message} aria-describedby={describedBy("c-message", errors.message)} required />
      </Field>
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="c-company">Company</label>
        <input id="c-company" name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={(e) => set("company", e.target.value)} />
      </div>
      <div>
        <div className="flex gap-4">
          <input id="c-consent" name="privacyConsent" type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[var(--espresso)]" checked={values.privacyConsent} onChange={(e) => set("privacyConsent", e.target.checked)} aria-invalid={!!errors.privacyConsent} aria-describedby={describedBy("c-consent", errors.privacyConsent)} required />
          <label htmlFor="c-consent" className="text-[0.95rem] text-ink-soft">
            I have read the{" "}
            <Link href="/privacy" target="_blank" className="text-ink underline underline-offset-4">
              privacy policy
            </Link>
            .
          </label>
        </div>
        {errors.privacyConsent && (
          <p id="c-consent-error" className="field-error pl-9">
            {errors.privacyConsent}
          </p>
        )}
      </div>
      <div>
        <button type="submit" className="btn btn-primary disabled:opacity-70" disabled={submitting}>
          {submitting ? "Sending…" : status === "error" ? "Try again" : "Send message"} {!submitting && <Arrow />}
        </button>
      </div>
    </form>
  );
}
