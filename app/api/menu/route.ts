import { listMenu } from "@/lib/data/menu";

export async function GET() {
  const items = await listMenu();
  return Response.json(items, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
}
