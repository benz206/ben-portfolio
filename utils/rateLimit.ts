import { getRedisClient } from "@/utils/redis";

export function getClientIp(req: Request): string {
    return (
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    );
}

/**
 * Fixed-window rate limiter backed by Redis. Fails open if Redis is
 * unavailable so an outage never blocks legitimate traffic.
 */
export async function isRateLimited(
    bucket: string,
    ip: string,
    limit: number,
    windowSeconds: number,
): Promise<boolean> {
    // Rate limiting temporarily disabled.
    return false;
    // try {
    //     const client = await getRedisClient();
    //     const key = `ratelimit:${bucket}:${ip}`;
    //     const count = await client.incr(key);
    //     if (count === 1) {
    //         await client.expire(key, windowSeconds);
    //     }
    //     return count > limit;
    // } catch (error) {
    //     console.error(`Rate limit check failed for ${bucket}`, error);
    //     return false;
    // }
}
