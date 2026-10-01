import { describe, expect, it } from "vitest";
import { articles } from "@/lib/articles";
import { serviceSlugs, services } from "@/lib/services";
import { makeReference } from "@/lib/reference";

describe("content integrity", () => {
  it("has one service entry per slug with FAQs", () => {
    expect(services.map((s) => s.slug)).toEqual([...serviceSlugs]);
    for (const s of services) expect(s.faqs.length).toBeGreaterThan(2);
  });

  it("has unique article slugs linked to real services", () => {
    const slugs = articles.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const a of articles) expect(serviceSlugs).toContain(a.relatedService);
  });

  it("makes readable, unambiguous booking references", () => {
    for (let i = 0; i < 50; i++) expect(makeReference()).toMatch(/^PH-[2-9A-HJKMNP-Z]{6}$/);
  });
});
