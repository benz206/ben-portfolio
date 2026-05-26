import { NextRequest, NextResponse } from "next/server";
import { lookupMessage } from "@/utils/messages";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

export async function POST(req: NextRequest) {
    try {
        const { name } = await req.json();
        if (!name || typeof name !== "string") {
            return NextResponse.json(
                { found: false },
                { headers: NO_STORE_HEADERS },
            );
        }

        const result = await lookupMessage(name.trim());
        if (!result) {
            return NextResponse.json(
                { found: false },
                { headers: NO_STORE_HEADERS },
            );
        }

        return NextResponse.json(
            { found: true, questions: result.questions },
            { headers: NO_STORE_HEADERS },
        );
    } catch {
        return NextResponse.json(
            { found: false },
            { headers: NO_STORE_HEADERS },
        );
    }
}
