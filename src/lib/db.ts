import { neon } from '@neondatabase/serverless';

export const getDbConnection = () => {
  // Use Neon's serverless driver (works with Cloudflare Workers)
  const connectionString = process.env.POSTGRES_URL!;
  return neon(connectionString);
};

export const sql = getDbConnection() as <T = any>(...args: any[]) => Promise<T>;
