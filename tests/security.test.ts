import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { __resetRateLimits, clientKey, rateLimit } from "@/lib/rate-limit";

describe("password hashing", () => {
  it("verifies the right password and rejects others", async () => {
    const hash = await hashPassword("correct horse battery");
    expect(hash.startsWith("scrypt$")).toBe(true);
    expect(hash).not.toContain("correct horse");
    expect(await verifyPassword("correct horse battery", hash)).toBe(true);
    expect(await verifyPassword("wrong", hash)).toBe(false);
  });

  it("salts each hash", async () => {
    expect(await hashPassword("same")).not.toBe(await hashPassword("same"));
  });

  it("rejects malformed stored hashes", async () => {
    expect(await verifyPassword("x", "plain-text")).toBe(false);
  });
});

describe("rate limiting", () => {
  it("allows up to the limit within the window", () => {
    __resetRateLimits();
    for (let i = 0; i < 3; i++) expect(rateLimit("k", 3, 60_000).ok).toBe(true);
    const blocked = rateLimit("k", 3, 60_000);
    expect(blocked.ok).toBe(false);
    expect(rateLimit("other", 3, 60_000).ok).toBe(true);
  });

  it("hashes client IPs rather than storing them", () => {
    const key = clientKey(new Headers({ "x-forwarded-for": "203.0.113.9, 10.0.0.1" }), "booking");
    expect(key).toMatch(/^booking:[0-9a-f]{32}$/);
    expect(key).not.toContain("203.0.113.9");
  });
});
