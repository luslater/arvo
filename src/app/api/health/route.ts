import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    const startTime = Date.now();
    try {
        // Ping database with a lightweight query
        await prisma.$queryRaw`SELECT 1`;
        const dbLatencyMs = Date.now() - startTime;

        return NextResponse.json({
            status: "healthy",
            timestamp: new Date().toISOString(),
            uptimeSeconds: process.uptime(),
            database: {
                status: "connected",
                latencyMs: dbLatencyMs,
            },
            version: "1.0.0",
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            status: "unhealthy",
            timestamp: new Date().toISOString(),
            error: "Database connectivity issue",
        }, { status: 503 });
    }
}
