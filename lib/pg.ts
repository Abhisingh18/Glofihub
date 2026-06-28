import { Pool } from 'pg';

/**
 * Single Postgres pool (survives HMR in dev & reuse in serverless).
 * Set DATABASE_URL to any Postgres (Neon / Railway / Render / local).
 */
declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

function makePool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set. Add it to .env.local (see CRM_SETUP.md).');
  }
  const local = /localhost|127\.0\.0\.1/.test(connectionString);
  return new Pool({
    connectionString,
    max: 5,
    ssl: local ? undefined : { rejectUnauthorized: false },
  });
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
