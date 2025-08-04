import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function listProducts() {
  const data = await sql`
    SELECT * FROM products
  `;

  return data;
}

export async function GET() {
  try {
    return Response.json(await listProducts());
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
