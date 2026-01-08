declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SPOTIFY_CLIENTID: string;
            SPOTIFY_SECRET: string;
            SPOTIFY_REFRESHTOKEN: string;
            PASSWORD: string;
        }
    }
}
