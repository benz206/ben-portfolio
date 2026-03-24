import { getRedisClient } from "@/utils/redis";

const RATE_LIMIT_TTL = 1800; // 30 minutes

/**
 * Returns true if the view should be counted (first hit from this IP
 * for this key within the TTL window), false if it's a repeat.
 *
 * Uses SET NX with an expiry — atomic, no race conditions.
 */
export async function shouldCountView(ip: string, key: string): Promise<boolean> {
    const client = await getRedisClient();
    const rateLimitKey = `ratelimit:views:${key}:${ip}`;

    // SET key value NX EX ttl — returns "OK" if set (first hit), null if already existed
    const result = await client.set(rateLimitKey, "1", {
        NX: true,
        EX: RATE_LIMIT_TTL,
    });

    return result === "OK";
}

export function getClientIp(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();
    return request.headers.get("x-real-ip") ?? "unknown";
}
