export type SpotifyPlaybackUpdate = {
    playingURI: string;
    isPaused: boolean;
    isBuffering: boolean;
    duration: number;
    position: number;
};

export type SpotifyEmbedController = {
    loadUri(uri: string, preferVideo?: boolean, startAt?: number): void;
    play(): void;
    pause(): void;
    resume(): void;
    togglePlay(): void;
    seek(seconds: number): void;
    destroy(): void;
    addListener(event: "ready", cb: () => void): void;
    addListener(
        event: "playback_update",
        cb: (e: { data: SpotifyPlaybackUpdate }) => void,
    ): void;
};

export type SpotifyIframeApi = {
    createController(
        element: HTMLElement,
        options: { uri?: string; width?: number | string; height?: number | string },
        callback: (controller: SpotifyEmbedController) => void,
    ): void;
};

declare global {
    interface Window {
        onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void;
    }
}
