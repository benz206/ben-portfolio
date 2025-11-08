import { NextResponse } from "next/server";
import { getRedisClient } from "@/utils/redis";

const PREFIX = "views:post:";

const toNumber = (value: string | null) => {
    if (!value) return 0;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
};

const getKey = (slug: string) => `${PREFIX}${slug}`;

type Params = {
    slug: string;
};

export async function GET(
    _request: Request,
    context: { params: Promise<Params> }
) {
    try {
        const params = await context.params;
        const slug = decodeURIComponent(params.slug);
        if (!slug) {
            return NextResponse.json({ count: 0 });
        }
        const client = await getRedisClient();
        const count = toNumber(await client.get(getKey(slug)));
        return NextResponse.json({ count });
    } catch (error) {
        console.error("Failed to fetch post views", error);
        return NextResponse.json(
            { error: "Failed to fetch views" },
            { status: 500 }
        );
    }
}

export async function POST(
    _request: Request,
    context: { params: Promise<Params> }
) {
    try {
        const params = await context.params;
        const slug = decodeURIComponent(params.slug);
        if (!slug) {
            return NextResponse.json({ count: 0 });
        }
        const client = await getRedisClient();
        const count = await client.incr(getKey(slug));
        return NextResponse.json({ count });
    } catch (error) {
        console.error("Failed to increment post views", error);
        return NextResponse.json(
            { error: "Failed to increment views" },
            { status: 500 }
        );
    }
}


