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

declare module "jpeg-js" {
    const jpeg: {
        decode: (
            data: Buffer | Uint8Array,
            options?: { useTArray?: boolean; formatAsRGBA?: boolean }
        ) => {
            width: number;
            height: number;
            data: Uint8Array;
        };
    };
    export default jpeg;
}
