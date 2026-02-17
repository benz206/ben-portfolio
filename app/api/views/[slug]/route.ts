import { NextResponse } from "next/server";
import { getRedisClient } from "@/utils/redis";

export const runtime = "nodejs";

const PREFIX = "views:post:";
const PUBLIC_CACHE_HEADERS = {
    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
};
const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

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
    context: { params: Promise<Params> },
) {
    try {
        const params = await context.params;
        const slug = decodeURIComponent(params.slug);
        if (!slug) {
            return NextResponse.json(
                { count: 0 },
                { headers: NO_STORE_HEADERS },
            );
        }
        const client = await getRedisClient();
        const count = toNumber(await client.get(getKey(slug)));
        return NextResponse.json({ count }, { headers: PUBLIC_CACHE_HEADERS });
    } catch (error) {
        console.error("Failed to fetch post views", error);
        return NextResponse.json(
            { error: "Failed to fetch views" },
            { status: 500, headers: NO_STORE_HEADERS },
        );
    }
}

export async function POST(
    _request: Request,
    context: { params: Promise<Params> },
) {
    try {
        const params = await context.params;
        const slug = decodeURIComponent(params.slug);
        if (!slug) {
            return NextResponse.json(
                { count: 0 },
                { headers: NO_STORE_HEADERS },
            );
        }
        const client = await getRedisClient();
        const count = await client.incr(getKey(slug));
        return NextResponse.json({ count }, { headers: NO_STORE_HEADERS });
    } catch (error) {
        console.error("Failed to increment post views", error);
        return NextResponse.json(
            { error: "Failed to increment views" },
            { status: 500, headers: NO_STORE_HEADERS },
        );
    }
}
