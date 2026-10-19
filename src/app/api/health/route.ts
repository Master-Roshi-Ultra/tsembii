import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

/** Railway-ийн healthcheck: апп ба өгөгдлийн сан ажиллаж байгаа эсэх */
export async function GET() {
  const ok = await db.$queryRaw`SELECT 1`.then(
    () => true,
    () => false,
  );
  return Response.json({ ok }, { status: ok ? 200 : 503 });
}
