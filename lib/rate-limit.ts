import "server-only";
import { createHash } from "node:crypto";

type Bucket = { hits: number[] };
const buckets = new Map<string, Bucket>();

/**
 * Sliding-window limiter held in process memory. Adequate for a single-instance
 * deployment; for multiple instances or serverless, swap for a shared store
 * (e.g. Redis/Upstash) behind this same function signature.
 */
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);
  if (bucket.hits.length >= limit) {
    buckets.set(key, bucket);
    const retryAfter = Math.ceil((windowMs - (now - bucket.hits[0])) / 1000);
    return { ok: false as const, retryAfter };
  }
  bucket.hits.push(now);
  buckets.set(key, bucket);

  // Opportunistic cleanup so the map can't grow without bound.
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.hits.every((t) => now - t >= windowMs)) buckets.delete(k);
  }
  return { ok: true as const };
}

/** Hash the client IP so raw addresses are never kept in memory or logs. */
export function clientKey(headers: Headers, scope: string) {
  const ip =
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown";
  const salt = process.env.RATE_LIMIT_SALT ?? "powerhouse";
  return `${scope}:${createHash("sha256").update(salt + ip).digest("hex").slice(0, 32)}`;
}

/** For tests. */
export function __resetRateLimits() {
  buckets.clear();
}
