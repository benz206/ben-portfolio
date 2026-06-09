import { NextResponse } from "next/server";
import { getRedisClient } from "@/utils/redis";
import { getClientIp, isRateLimited } from "@/utils/rateLimit";

export const runtime = "nodejs";

const KEY = "views:global";
const DAILY_KEY = "views:global:daily";
const DAILY_DATE_KEY = "views:global:daily:date";
const PUBLIC_CACHE_HEADERS = {
    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
};
const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
};

const getNextMidnightTimestamp = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return Math.floor(midnight.getTime() / 1000);
};

const toNumber = (value: string | null) => {
    if (!value) return 0;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
};

export async function GET() {
    try {
        const client = await getRedisClient();
        const count = toNumber(await client.get(KEY));
        const dailyCount = toNumber(await client.get(DAILY_KEY));

        return NextResponse.json(
            {
                count,
                daily: dailyCount,
            },
            { headers: PUBLIC_CACHE_HEADERS },
        );
    } catch (error) {
        console.error("Failed to fetch global views", error);
        return NextResponse.json(
            { error: "Failed to fetch views" },
            { status: 500, headers: NO_STORE_HEADERS },
        );
    }
}

export async function POST(request: Request) {
    try {
        const ip = getClientIp(request);
        if (await isRateLimited("views:global", ip, 30, 60)) {
            return NextResponse.json(
                { error: "Rate limited" },
                { status: 429, headers: NO_STORE_HEADERS },
            );
        }
        const client = await getRedisClient();
        const count = await client.incr(KEY);

        const today = getTodayDate();
        const nextMidnight = getNextMidnightTimestamp();

        const dailyResult = await client.eval(
            `
local dailyKey = KEYS[1]
local dateKey = KEYS[2]
local today = ARGV[1]
local midnight = tonumber(ARGV[2])

local stored = redis.call("GET", dateKey)
if stored ~= today then
  redis.call("SET", dailyKey, "0")
  redis.call("SET", dateKey, today)
  redis.call("EXPIREAT", dailyKey, midnight)
  redis.call("EXPIREAT", dateKey, midnight)
else
  local ttlDaily = redis.call("TTL", dailyKey)
  if ttlDaily < 0 then
    redis.call("EXPIREAT", dailyKey, midnight)
  end
  local ttlDate = redis.call("TTL", dateKey)
  if ttlDate < 0 then
    redis.call("EXPIREAT", dateKey, midnight)
  end
end

return redis.call("INCR", dailyKey)
            `.trim(),
            {
                keys: [DAILY_KEY, DAILY_DATE_KEY],
                arguments: [today, String(nextMidnight)],
            },
        );

        const dailyCount =
            typeof dailyResult === "number"
                ? dailyResult
                : toNumber(
                      typeof dailyResult === "string"
                          ? dailyResult
                          : String(dailyResult),
                  );

        return NextResponse.json(
            {
                count,
                daily: dailyCount,
            },
            { headers: NO_STORE_HEADERS },
        );
    } catch (error) {
        console.error("Failed to increment global views", error);
        return NextResponse.json(
            { error: "Failed to increment views" },
            { status: 500, headers: NO_STORE_HEADERS },
        );
    }
}
