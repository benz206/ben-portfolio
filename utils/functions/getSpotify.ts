import type { SpotifyTokenResponse } from "@/types/externalApis";
import { getRedisClient } from "@/utils/redis";

const REDIS_TOKEN_KEY = "spotify:access_token";
const REDIS_EXPIRY_KEY = "spotify:token_expiry";

let memoryToken = "";
let memoryExpiry = 0;

export default async function getSpotifyAccessToken() {
    const { SPOTIFY_CLIENTID, SPOTIFY_SECRET, SPOTIFY_REFRESHTOKEN } =
        process.env;

    if (memoryToken && Date.now() < memoryExpiry) {
        return memoryToken;
    }

    try {
        const redis = await getRedisClient();
        const [cachedToken, cachedExpiry] = await Promise.all([
            redis.get(REDIS_TOKEN_KEY),
            redis.get(REDIS_EXPIRY_KEY),
        ]);

        if (cachedToken && cachedExpiry && Date.now() < Number(cachedExpiry)) {
            memoryToken = cachedToken;
            memoryExpiry = Number(cachedExpiry);
            return cachedToken;
        }
    } catch (error) {
        console.error("Failed to read cached Spotify token", error);
    }

    const authString = Buffer.from(
        `${SPOTIFY_CLIENTID}:${SPOTIFY_SECRET}`,
    ).toString("base64");

    const tokenResponse = await fetch(
        "https://accounts.spotify.com/api/token",
        {
            method: "POST",
            headers: {
                Authorization: `Basic ${authString}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: SPOTIFY_REFRESHTOKEN || "",
            }),
        },
    );

    const tokenData = (await tokenResponse.json()) as SpotifyTokenResponse;
    if (!tokenResponse.ok || !tokenData.access_token) {
        throw new Error(
            `Spotify token refresh failed (${tokenResponse.status})`,
        );
    }

    const expiry = Date.now() + tokenData.expires_in * 1000;
    memoryToken = tokenData.access_token;
    memoryExpiry = expiry;

    try {
        const redis = await getRedisClient();
        const ttlSeconds = Math.max(Math.floor(tokenData.expires_in * 0.9), 1);
        await Promise.all([
            redis.set(REDIS_TOKEN_KEY, tokenData.access_token, {
                EX: ttlSeconds,
            }),
            redis.set(REDIS_EXPIRY_KEY, String(expiry), { EX: ttlSeconds }),
        ]);
    } catch (error) {
        console.error("Failed to cache Spotify token", error);
    }

    return tokenData.access_token;
}
