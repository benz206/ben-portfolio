import { NextResponse } from "next/server";
import { buildPageView, recordPageView } from "@/utils/pageview";
import { getClientIp, isRateLimited } from "@/utils/rateLimit";

export const runtime = "nodejs";

const NO_STORE = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
    try {
        const ip = getClientIp(request);
        if (await isRateLimited("track", ip, 120, 60)) {
            return NextResponse.json(
                { ok: false },
                { status: 429, headers: NO_STORE },
            );
        }

        const payload = await request.json().catch(() => null);
        const view = buildPageView(payload, request.headers);
        if (!view) {
            return NextResponse.json(
                { ok: false },
                { status: 400, headers: NO_STORE },
            );
        }

        await recordPageView(view);
        return NextResponse.json({ ok: true }, { headers: NO_STORE });
    } catch (error) {
        console.error("Failed to record pageview", error);
        // Fail open — tracking must never surface errors to visitors.
        return NextResponse.json(
            { ok: false },
            { status: 500, headers: NO_STORE },
        );
    }
}
