import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const PUBLIC_CACHE_HEADERS = {
    "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};
const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function GET() {
    try {
        const result = await cloudinary.search
            .sort_by("uploaded_at", "desc")
            .max_results(1)
            .execute();
        const total =
            typeof result.total_count === "number"
                ? result.total_count
                : Array.isArray(result.resources)
                  ? result.resources.length
                  : 0;
        const latest =
            Array.isArray(result.resources) && result.resources.length > 0
                ? (result.resources[0]?.uploaded_at ??
                  result.resources[0]?.created_at)
                : null;
        return NextResponse.json(
            { total, latestUploadedAt: latest },
            { headers: PUBLIC_CACHE_HEADERS },
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch Cloudinary status" },
            { status: 500, headers: NO_STORE_HEADERS },
        );
    }
}
