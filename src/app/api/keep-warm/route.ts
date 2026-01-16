import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic'; // Prevent caching

export async function GET() {
  const data = await sql`SELECT * FROM products LIMIT 10`;
  console.log('Neon is awake', JSON.stringify(data));
  return new Response('Neon is awake', {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
