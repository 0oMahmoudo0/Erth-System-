// Database connection checker.
//
// Test the URL in your local .env:
//   node --env-file=.env scripts/check-db.mjs
//
// Test a specific URL (e.g. the one you put in Vercel):
//   node scripts/check-db.mjs "postgres://user:pass@host:5432/postgres?sslmode=require"

import pg from "pg";

const raw = process.argv[2] ?? process.env.DATABASE_URL ?? "";

if (!raw) {
  console.error("❌ No connection string found (DATABASE_URL is empty).");
  process.exit(1);
}

if (/^\s|\s$/.test(raw)) console.warn("⚠️  The URL has leading/trailing spaces or newlines.");
if (/^["']|["']$/.test(raw.trim())) console.warn("⚠️  The URL is wrapped in quotes. Remove them in Vercel.");

const url = raw.trim().replace(/^["']|["']$/g, "");

try {
  const u = new URL(url);
  console.log(`Host: ${u.hostname}  Port: ${u.port || 5432}  DB: ${u.pathname.slice(1) || "(default)"}`);
  console.log(`User: ${u.username.slice(0, 8)}…  Password: ${u.password ? "set (" + u.password.length + " chars)" : "MISSING"}`);
} catch {
  console.error("❌ The connection string is not a valid URL.");
  process.exit(1);
}

const client = new pg.Client({ connectionString: url, connectionTimeoutMillis: 10000 });

try {
  await client.connect();
  const { rows } = await client.query("SELECT current_user, now() AS server_time");
  console.log("✅ Connected successfully.", rows[0]);

  const tables = await client.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
  );
  const names = tables.rows.map((r) => r.table_name);
  console.log(`Tables (${names.length}):`, names.join(", ") || "(none)");

  if (names.includes("User")) {
    const users = await client.query('SELECT COUNT(*)::int AS count FROM "User"');
    console.log(`✅ "User" table exists with ${users.rows[0].count} user(s).`);
  } else {
    console.log('❌ "User" table is MISSING — the schema has not been pushed to this database.');
  }
} catch (e) {
  console.error("❌ Connection failed:", e.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
