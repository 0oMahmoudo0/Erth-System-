import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

/**
 * Cleans up a connection string that may have been copy-pasted with
 * surrounding quotes or whitespace/newlines (common when pasting a value
 * from a .env file into the Vercel dashboard). Such characters silently
 * corrupt the username/password and cause "credentials are incorrect".
 */
function sanitize(url: string | undefined): string | undefined {
  if (!url) return undefined;
  let cleaned = url.trim();
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  return cleaned || undefined;
}

function getConnectionString(rawUrl: string | undefined): string | undefined {
  const url = sanitize(rawUrl);
  if (!url) return undefined;
  if (url.startsWith('prisma+postgres://')) {
    try {
      const urlObj = new URL(url);
      const apiKey = urlObj.searchParams.get('api_key');
      if (apiKey) {
        const decoded = Buffer.from(apiKey, 'base64').toString('utf8');
        const parsed = JSON.parse(decoded);
        return parsed.databaseUrl;
      }
    } catch (e) {
      console.error("Failed to parse prisma+postgres URL", e);
    }
  }
  return url;
}

// DATABASE_URL is the primary variable. POSTGRES_URL is a fallback that the
// Vercel <-> Prisma Postgres integration also provides.
const connectionString = getConnectionString(
  process.env.DATABASE_URL || process.env.POSTGRES_URL
);
if (!connectionString) {
  throw new Error(
    "DATABASE_URL environment variable is missing. Set it in Vercel → Project → Settings → Environment Variables."
  );
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  // Small pool + timeouts suit serverless: each Vercel function instance gets
  // its own pool, so large pools can exhaust the database's connection limit.
  const pool = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  });

  // Without this listener, a dropped idle connection (network blip, DB
  // restart) emits an unhandled 'error' event and crashes the process.
  pool.on('error', (err) => {
    console.error('[db] Idle database connection error:', err.message);
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

// Reuse a single client per server instance (dev hot-reload and warm
// serverless invocations) instead of opening new pools repeatedly.
export const prisma = globalForPrisma.prisma ?? createPrismaClient();
globalForPrisma.prisma = prisma;
