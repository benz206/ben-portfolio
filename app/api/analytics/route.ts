import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { getAnalytics } from "@/utils/pageview";

export const runtime = "nodejs";

const NO_STORE = { "Cache-Control": "no-store" };

function isAuthorized(request: Request): boolean {
    const expected = process.env.PASSWORD;
    if (!expected) return false;
    const provided =
        request.headers.get("x-admin-key") ??
        request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
        "";
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
}

export async function GET(request: Request) {
    if (!isAuthorized(request)) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401, headers: NO_STORE },
        );
    }

    try {
        const { searchParams } = new URL(request.url);
        const requested = Number(searchParams.get("days") ?? 30);
        const days = Number.isFinite(requested)
            ? Math.min(Math.max(Math.trunc(requested), 1), 365)
            : 30;

        const analytics = await getAnalytics(days);
        return NextResponse.json(analytics, { headers: NO_STORE });
    } catch (error) {
        console.error("Failed to fetch analytics", error);
        return NextResponse.json(
            { error: "Failed to fetch analytics" },
            { status: 500, headers: NO_STORE },
        );
    }
}
