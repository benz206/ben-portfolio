import { NextRequest, NextResponse } from "next/server";
import { getRedisClient } from "@/utils/redis";
import { getClientIp, isRateLimited } from "@/utils/rateLimit";

export const runtime = "nodejs";

const KEY = "presence:viewers";
const WINDOW_SECONDS = 2 * 60;
const NO_STORE = { "Cache-Control": "no-store" };
const SESSION_ID_PATTERN = /^[a-zA-Z0-9-]{1,64}$/;

export async function GET() {
    try {
        const client = await getRedisClient();
        const cutoff = Date.now() - WINDOW_SECONDS * 1000;
        await client.zRemRangeByScore(KEY, "-inf", cutoff);
        const count = await client.zCard(KEY);
        return NextResponse.json({ viewers: count }, { headers: NO_STORE });
    } catch (error) {
        console.error("Presence GET failed", error);
        return NextResponse.json(
            { error: "Failed to fetch presence" },
            { status: 500, headers: NO_STORE },
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { sessionId, leave } = await request.json();
        if (
            !sessionId ||
            typeof sessionId !== "string" ||
            !SESSION_ID_PATTERN.test(sessionId)
        ) {
            return NextResponse.json(
                { error: "Invalid sessionId" },
                { status: 400, headers: NO_STORE },
            );
        }

        const ip = getClientIp(request);
        if (await isRateLimited("presence", ip, 60, 60)) {
            return NextResponse.json(
                { error: "Rate limited" },
                { status: 429, headers: NO_STORE },
            );
        }

        const client = await getRedisClient();
        const now = Date.now();
        const cutoff = now - WINDOW_SECONDS * 1000;

        if (leave) {
            await client
                .multi()
                .zRem(KEY, sessionId)
                .zRemRangeByScore(KEY, "-inf", cutoff)
                .exec();
        } else {
            await client
                .multi()
                .zAdd(KEY, { score: now, value: sessionId })
                .zRemRangeByScore(KEY, "-inf", cutoff)
                .expire(KEY, WINDOW_SECONDS + 60)
                .exec();
        }

        const count = await client.zCard(KEY);
        return NextResponse.json({ viewers: count }, { headers: NO_STORE });
    } catch (error) {
        console.error("Presence POST failed", error);
        return NextResponse.json(
            { error: "Failed to update presence" },
            { status: 500, headers: NO_STORE },
        );
    }
}
