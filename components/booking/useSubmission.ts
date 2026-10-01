"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SubmitStatus = "idle" | "submitting" | "success" | "duplicate" | "error";

/**
 * Shared submit lifecycle for public forms: one idempotency key per logical
 * submission (kept across retries so the server can de-duplicate), a
 * time-on-page signal for bot filtering, and an in-flight guard against
 * double submits.
 */
export function useSubmission<TResult>(endpoint: string) {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [serverFieldErrors, setServerFieldErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<TResult | null>(null);
  const keyRef = useRef<string | null>(null);
  const openedAt = useRef(0);
  const inFlight = useRef(false);

  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  const submit = useCallback(
    async (payload: Record<string, unknown>) => {
      if (inFlight.current) return;
      inFlight.current = true;
      keyRef.current ??= crypto.randomUUID();
      setStatus("submitting");
      setMessage(null);
      setServerFieldErrors({});
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, idempotencyKey: keyRef.current, elapsedMs: Date.now() - openedAt.current }),
        });
        const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
        if (res.ok) {
          setResult(data as TResult);
          setStatus("success");
          return;
        }
        if (res.status === 409 && data.code === "duplicate") {
          setStatus("duplicate");
          setMessage(String(data.error));
          return;
        }
        if (res.status === 422 && data.fieldErrors) {
          setServerFieldErrors(data.fieldErrors as Record<string, string>);
        }
        setStatus("error");
        setMessage(typeof data.error === "string" ? data.error : "Something went wrong. Please try again.");
      } catch {
        setStatus("error");
        setMessage("We couldn't reach the server. Please check your connection and try again.");
      } finally {
        inFlight.current = false;
      }
    },
    [endpoint],
  );

  return { status, message, serverFieldErrors, result, submit };
}
