declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SPOTIFY_CLIENTID: string;
            SPOTIFY_SECRET: string;
            SPOTIFY_REFRESHTOKEN: string;
            PASSWORD: string;
            BLOG_PAT: string;
            REDIS_URL: string;
            NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string;
            NEXT_PUBLIC_CLOUDINARY_API_KEY: string;
            CLOUDINARY_API_SECRET: string;
        }
    }
}
