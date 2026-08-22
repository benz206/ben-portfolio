export type SpotifyTimeRange = "short_term" | "medium_term" | "long_term";

export type SpotifyTokenResponse = {
    access_token: string;
    token_type: string;
    scope?: string;
    expires_in: number;
    refresh_token?: string;
};

export type SpotifyExternalUrls = {
    spotify: string;
};

export type SpotifyImageObject = {
    url: string;
    height?: number | null;
    width?: number | null;
};

export type SpotifyAlbum = {
    name: string;
    images: SpotifyImageObject[];
};

export type SpotifyTrack = {
    name: string;
    duration_ms: number;
    artists: Array<{ name: string }>;
    album: SpotifyAlbum;
    external_urls?: SpotifyExternalUrls;
};

export type SpotifyArtist = {
    name: string;
    genres?: string[];
    images?: SpotifyImageObject[];
    external_urls?: SpotifyExternalUrls;
    followers?: { total: number };
};

export type SpotifyPaging<T> = {
    href: string;
    items: T[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
};

export type SpotifyPlaybackState = {
    item: SpotifyTrack | null;
    progress_ms: number | null;
    is_playing: boolean;
    device?: { volume_percent?: number | null } | null;
    shuffle_state: boolean;
    repeat_state: string;
};
