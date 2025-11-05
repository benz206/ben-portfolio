import { NextResponse } from "next/server";
import { getRedisClient } from "@/utils/redis";

const KEY = "views:global";

const toNumber = (value: string | null) => {
    if (!value) return 0;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
};

export async function GET() {
    try {
        const client = await getRedisClient();
        const count = toNumber(await client.get(KEY));
        return NextResponse.json({ count });
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
        return NextResponse.json({ count });
    } catch (error) {
        console.error("Failed to increment global views", error);
        return NextResponse.json(
            { error: "Failed to increment views" },
            { status: 500 }
        );
    }
}


