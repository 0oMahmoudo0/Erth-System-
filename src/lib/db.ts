import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

function getConnectionString(url: string | undefined): string | undefined {
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

const connectionString = getConnectionString(process.env.DATABASE_URL);
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is missing.");
}

// Instantiate pg Pool explicitly to ensure stable connection
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
