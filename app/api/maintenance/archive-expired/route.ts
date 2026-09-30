import { NextResponse } from "next/server";
import { db } from "@/lib/db";
export async function POST(request: Request) { const secret = process.env.CRON_SECRET; if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); const result = await db.stickyNote.updateMany({ where: { status: "ACTIVE", deletedAt: null, expiresAt: { not: null, lte: new Date() } }, data: { status: "ARCHIVED", archivedAt: new Date() } }); return NextResponse.json({ archived: result.count }); }
