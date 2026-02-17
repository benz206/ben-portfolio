import getSpotifyAccessToken from "@/utils/functions/getSpotify";
import { NextRequest, NextResponse } from "next/server";

const changes = [
    "playPause",
    "skip",
    "back",
    "vinc",
    "vdec",
    "loop",
    "shuffle",
] as const;
const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

async function getPlayerData(accessToken: string) {
    const response = await fetch(`https://api.spotify.com/v1/me/player`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) return null;
    return response.json();
}

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ password: string; change: string }> },
) {
    const { password, change } = await context.params;

    if (password !== process.env.PASSWORD) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401, headers: NO_STORE_HEADERS },
        );
    }
    if (!changes.includes(change as any)) {
        return NextResponse.json(
            { error: "Invalid change" },
            { status: 400, headers: NO_STORE_HEADERS },
        );
    }

    try {
        const accessToken = await getSpotifyAccessToken();
        let url = "";
        let method = "";

        if (change === "playPause") {
            const data = await getPlayerData(accessToken);
            if (!data)
                return NextResponse.json(
                    { error: "Player error" },
                    { status: 500, headers: NO_STORE_HEADERS },
                );
            if (!data.is_playing) {
                url = "https://api.spotify.com/v1/me/player/play";
                method = "PUT";
            } else {
                url = "https://api.spotify.com/v1/me/player/pause";
                method = "PUT";
            }
        } else if (change === "skip") {
            url = `https://api.spotify.com/v1/me/player/next`;
            method = "POST";
        } else if (change === "back") {
            url = `https://api.spotify.com/v1/me/player/previous`;
            method = "POST";
        } else if (change === "vinc" || change === "vdec") {
            const data = await getPlayerData(accessToken);
            if (!data)
                return NextResponse.json(
                    { error: "Player error" },
                    { status: 500, headers: NO_STORE_HEADERS },
                );
            let volume = data.device.volume_percent;
            if (change === "vinc") {
                volume = Math.min(volume + 10, 100);
            } else {
                volume = Math.max(volume - 10, 0);
            }
            url = `https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`;
            method = "PUT";
        } else if (change === "loop") {
            const data = await getPlayerData(accessToken);
            if (!data)
                return NextResponse.json(
                    { error: "Player error" },
                    { status: 500, headers: NO_STORE_HEADERS },
                );
            let state = data.repeat_state;
            if (state === "track") state = "context";
            else if (state === "context") state = "off";
            else state = "track";
            url = `https://api.spotify.com/v1/me/player/repeat?state=${state}`;
            method = "PUT";
        } else if (change === "shuffle") {
            const data = await getPlayerData(accessToken);
            if (!data)
                return NextResponse.json(
                    { error: "Player error" },
                    { status: 500, headers: NO_STORE_HEADERS },
                );
            url = `https://api.spotify.com/v1/me/player/shuffle?state=${!data.shuffle_state}`;
            method = "PUT";
        }

        await fetch(url, {
            method,
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return NextResponse.json(
            { answer: "Success" },
            { headers: NO_STORE_HEADERS },
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500, headers: NO_STORE_HEADERS },
        );
    }
}
