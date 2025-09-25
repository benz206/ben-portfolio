let accessToken = "";
let tokenExpiration = 0;

export default async function getSpotifyAccessToken() {
    const { SPOTIFY_CLIENTID, SPOTIFY_SECRET, SPOTIFY_REFRESHTOKEN } =
        process.env;

    if (Date.now() < tokenExpiration) {
        return accessToken;
    }

    const authString = Buffer.from(
        `${SPOTIFY_CLIENTID}:${SPOTIFY_SECRET}`
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
        }
    );

    const tokenData = await tokenResponse.json();

    accessToken = tokenData.access_token;
    tokenExpiration = Date.now() + tokenData.expires_in * 1000;

    return accessToken;
}
