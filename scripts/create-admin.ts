/**
 * Creates or resets the practitioner's admin login.
 *
 *   npm run admin:create -- you@example.com
 *
 * The password is read from ADMIN_PASSWORD if set, otherwise prompted for
 * (input hidden). Only the scrypt hash is stored.
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { hashPassword } from "../lib/auth/password";
import { adminUsers } from "../lib/db/schema";

async function promptHidden(question: string): Promise<string> {
  process.stdout.write(question);
  const stdin = process.stdin;
  if (!stdin.isTTY) {
    const chunks: Buffer[] = [];
    for await (const c of stdin) chunks.push(c as Buffer);
    return Buffer.concat(chunks).toString().trim();
  }
  stdin.setRawMode(true);
  stdin.resume();
  let value = "";
  return new Promise((resolve) => {
    stdin.on("data", (buf) => {
      const ch = buf.toString();
      if (ch === "\r" || ch === "\n") {
        stdin.setRawMode(false);
        stdin.pause();
        process.stdout.write("\n");
        resolve(value);
      } else if (ch === "\u0003") process.exit(1);
      else if (ch === "\u007f") value = value.slice(0, -1);
      else value += ch;
    });
  });
}

async function main() {
  const email = (process.argv[2] ?? process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    console.error("Usage: npm run admin:create -- you@example.com");
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }
  const password = process.env.ADMIN_PASSWORD ?? (await promptHidden("Password (min 12 characters): "));
  if (password.length < 12) {
    console.error("Password must be at least 12 characters.");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);
  const passwordHash = await hashPassword(password);
  await db
    .insert(adminUsers)
    .values({ email, passwordHash })
    .onConflictDoUpdate({ target: adminUsers.email, set: { passwordHash } });
  await pool.end();
  console.log(`Admin login ready for ${email}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
