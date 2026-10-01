import { describe, expect, it } from "vitest";
import { bookingSchema, contactSchema, fieldErrors } from "@/lib/validation/booking";

const inDays = (n: number) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
const valid = {
  name: "  Asha Rao ",
  email: " Asha@Example.COM ",
  phone: "",
  service: "numerology",
  preferredDate: inDays(5),
  preferredTime: "morning",
  sessionFormat: "",
  message: "",
  privacyConsent: true,
  idempotencyKey: "6f1c1b8e-0d3f-4c55-9d3b-2b1a5b8f9e10",
  company: "",
};

describe("bookingSchema", () => {
  it("accepts a valid enquiry and normalises fields", () => {
    const r = bookingSchema.parse(valid);
    expect(r.name).toBe("Asha Rao");
    expect(r.email).toBe("asha@example.com");
    expect(r.phone).toBeNull();
    expect(r.message).toBeNull();
  });

  it("rejects unknown services, past dates and missing consent", () => {
    const r = bookingSchema.safeParse({ ...valid, service: "astrology", preferredDate: "2000-01-01", privacyConsent: false });
    expect(r.success).toBe(false);
    const errs = fieldErrors(r.error!);
    expect(Object.keys(errs).sort()).toEqual(["preferredDate", "privacyConsent", "service"]);
  });

  it("rejects dates more than a year ahead", () => {
    expect(bookingSchema.safeParse({ ...valid, preferredDate: inDays(400) }).success).toBe(false);
  });

  it("rejects a session format while none are offered", () => {
    const r = bookingSchema.safeParse({ ...valid, sessionFormat: "phone" });
    expect(r.success).toBe(false);
  });

  it("flags the honeypot", () => {
    const r = bookingSchema.safeParse({ ...valid, company: "Acme" });
    expect(r.success).toBe(false);
    expect(fieldErrors(r.error!).company).toBeDefined();
  });

  it("rejects markup in names and malformed phone numbers", () => {
    expect(bookingSchema.safeParse({ ...valid, name: "<script>" }).success).toBe(false);
    expect(bookingSchema.safeParse({ ...valid, phone: "call me" }).success).toBe(false);
    expect(bookingSchema.safeParse({ ...valid, phone: "+91 98765 43210" }).success).toBe(true);
  });
});

describe("contactSchema", () => {
  it("requires a meaningful message", () => {
    const base = { name: "Asha", email: "a@b.co", subject: "Hi", message: "short", privacyConsent: true, idempotencyKey: valid.idempotencyKey };
    expect(contactSchema.safeParse(base).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, message: "A longer question about sessions." }).success).toBe(true);
  });
});
