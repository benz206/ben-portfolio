import { NextResponse } from "next/server";
import { getRedisClient } from "@/utils/redis";

const KEY = "views:global";
const DAILY_KEY = "views:global:daily";
const DAILY_DATE_KEY = "views:global:daily:date";

const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
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
        
        return NextResponse.json({ 
            count,
            daily: dailyCount 
        });
    } catch (error) {
        console.error("Failed to fetch global views", error);
        return NextResponse.json(
            { error: "Failed to fetch views" },
            { status: 500 }
        );
    }
}

export async function POST() {
    try {
        const client = await getRedisClient();
        const count = await client.incr(KEY);
        
        const today = getTodayDate();
        const storedDate = await client.get(DAILY_DATE_KEY);
        
        if (storedDate !== today) {
            await client.set(DAILY_KEY, "0");
            await client.set(DAILY_DATE_KEY, today);
            await client.expireAt(DAILY_DATE_KEY, getNextMidnightTimestamp());
        }
        
        const dailyCount = await client.incr(DAILY_KEY);
        
        if (dailyCount === 1 && storedDate !== today) {
            await client.expireAt(DAILY_KEY, getNextMidnightTimestamp());
        }
        
        return NextResponse.json({ 
            count,
            daily: dailyCount 
        });
    } catch (error) {
        console.error("Failed to increment global views", error);
        return NextResponse.json(
            { error: "Failed to increment views" },
            { status: 500 }
        );
    }
}


