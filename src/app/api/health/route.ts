import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Health check: GET /api/health
 * Returns 200 when the app can reach the database, 503 otherwise.
 * Point a free uptime monitor (e.g. UptimeRobot) at this URL to get an
 * email alert as soon as the database becomes unreachable.
 */
export async function GET() {
  const started = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json(
      { status: "ok", database: "connected", latencyMs: Date.now() - started },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    console.error("[health] Database check failed:", e);
    return NextResponse.json(
      { status: "error", database: "unreachable" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
