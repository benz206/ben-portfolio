import { NextRequest, NextResponse } from "next/server";
import { verifyAndGetMessage } from "@/utils/messages";
import { getRedisClient } from "@/utils/redis";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };
const RATE_LIMIT_SECONDS = 300;

function getClientIp(req: NextRequest): string {
    return (
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    );
}

export async function POST(req: NextRequest) {
    const ip = getClientIp(req);
    const rateLimitKey = `ratelimit:messages:${ip}`;

    try {
        const redis = await getRedisClient();
        const existing = await redis.get(rateLimitKey);
        if (existing) {
            const ttl = await redis.ttl(rateLimitKey);
            return NextResponse.json(
                { correct: false, rateLimited: true, retryAfter: ttl > 0 ? ttl : RATE_LIMIT_SECONDS },
                { status: 429, headers: NO_STORE_HEADERS },
            );
        }
    } catch {
        // If Redis is unavailable, skip rate limiting
    }

    try {
        const { name, answers } = await req.json();
        if (!name || typeof name !== "string" || !Array.isArray(answers)) {
            return NextResponse.json(
                { correct: false },
                { headers: NO_STORE_HEADERS },
            );
        }

        const result = await verifyAndGetMessage(name.trim(), answers);

        if (!result) {
            try {
                const redis = await getRedisClient();
                await redis.set(rateLimitKey, "1", { EX: RATE_LIMIT_SECONDS });
            } catch {
                // Ignore Redis errors for rate limiting
            }
            return NextResponse.json(
                { correct: false },
                { headers: NO_STORE_HEADERS },
            );
        }

        return NextResponse.json(
            { correct: true, message: result.message, senderName: result.senderName },
            { headers: NO_STORE_HEADERS },
        );
    } catch {
        return NextResponse.json(
            { correct: false },
            { headers: NO_STORE_HEADERS },
        );
    }
}
