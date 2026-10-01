import "server-only";
import { NextResponse } from "next/server";

export const json = (body: unknown, status = 200, headers?: HeadersInit) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

/** Reject cross-site form posts and non-JSON bodies before doing any work. */
export async function readJsonBody(req: Request, maxBytes = 16_000) {
  const type = req.headers.get("content-type") ?? "";
  if (!type.includes("application/json")) return { error: json({ error: "Unsupported content type." }, 415) };

  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return { error: json({ error: "Cross-origin requests are not allowed." }, 403) };
  }

  const text = await req.text();
  if (text.length > maxBytes) return { error: json({ error: "Request too large." }, 413) };
  try {
    return { body: JSON.parse(text) as unknown };
  } catch {
    return { error: json({ error: "Malformed request." }, 400) };
  }
}

/** Submissions completed faster than a person could type are treated as bots. */
export const MIN_HUMAN_MS = 2500;
