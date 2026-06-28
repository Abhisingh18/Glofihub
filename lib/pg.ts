import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Neon serverless driver talks over HTTPS/WSS (port 443) — works on Vercel and
// on networks where the raw Postgres port (5432) is blocked.
neonConfig.webSocketConstructor = ws;

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

function makePool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set. Add it to .env.local (see CRM_SETUP.md).');
  }
  return new Pool({ connectionString });
}

export function getPool(): Pool {
  if (!global.__pgPool) global.__pgPool = makePool();
  return global.__pgPool;
}

/** True when a database connection string is configured. */
export const isDbConfigured = Boolean(process.env.DATABASE_URL);

/** Run a query, return all rows. */
export async function sql<T = Record<string, unknown>>(text: string, params: unknown[] = []): Promise<T[]> {
  const res = await getPool().query(text, params);
  return res.rows as T[];
}

/** Run a query, return the first row or null. */
export async function one<T = Record<string, unknown>>(text: string, params: unknown[] = []): Promise<T | null> {
  const rows = await sql<T>(text, params);
  return rows[0] ?? null;
}
