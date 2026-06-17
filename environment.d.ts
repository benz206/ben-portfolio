declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SPOTIFY_CLIENTID: string;
            SPOTIFY_SECRET: string;
            SPOTIFY_REFRESHTOKEN: string;
            BLOG_PAT: string;
            REDIS_URL: string;
            MONGO_URL: string;
            MONGO_USER: string;
            MONGO_PASS: string;
            PASSWORD: string;
            NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string;
            NEXT_PUBLIC_CLOUDINARY_API_KEY: string;
            CLOUDINARY_API_SECRET: string;
        }
    }
}
