import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const bookingStatus = pgEnum("booking_status", [
  "new",
  "contacted",
  "confirmed",
  "completed",
  "cancelled",
]);

export const serviceEnum = pgEnum("service", [
  "numerology",
  "reiki-healing",
  "career-counselling",
  "relationship-counselling",
]);

export const contactStatus = pgEnum("contact_status", ["new", "replied", "archived"]);

/**
 * A booking row starts life as an *enquiry* (status "new"). It only becomes an
 * appointment when the practitioner sets status "confirmed" in the admin area.
 */
export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    reference: varchar("reference", { length: 16 }).notNull().unique(),
    name: varchar("name", { length: 120 }).notNull(),
    email: varchar("email", { length: 254 }).notNull(),
    phone: varchar("phone", { length: 32 }),
    service: serviceEnum("service").notNull(),
    preferredDate: date("preferred_date").notNull(),
    preferredTime: varchar("preferred_time", { length: 32 }).notNull(),
    sessionFormat: varchar("session_format", { length: 32 }),
    message: text("message"),
    privacyConsent: boolean("privacy_consent").notNull(),
    status: bookingStatus("status").notNull().default("new"),
    adminNotes: text("admin_notes"),
    /** Client-generated key so a double-click or retry never creates two rows. */
    idempotencyKey: uuid("idempotency_key").notNull().unique(),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("bookings_status_idx").on(t.status),
    index("bookings_service_idx").on(t.service),
    index("bookings_email_idx").on(t.email),
    index("bookings_created_idx").on(t.createdAt),
  ],
);

export const contactMessages = pgTable(
  "contact_messages",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 120 }).notNull(),
    email: varchar("email", { length: 254 }).notNull(),
    subject: varchar("subject", { length: 160 }).notNull(),
    message: text("message").notNull(),
    status: contactStatus("status").notNull().default("new"),
    idempotencyKey: uuid("idempotency_key").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("contact_created_idx").on(t.createdAt)],
);

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email", { length: 254 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Server-side sessions. Only a SHA-256 of the cookie token is stored. */
export const adminSessions = pgTable(
  "admin_sessions",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => adminUsers.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("admin_sessions_user_idx").on(t.userId)],
);

export type Booking = typeof bookings.$inferSelect;
export type BookingStatus = (typeof bookingStatus.enumValues)[number];
export type ContactMessage = typeof contactMessages.$inferSelect;
export type ContactStatus = (typeof contactStatus.enumValues)[number];
