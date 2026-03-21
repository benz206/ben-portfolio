import { createClient } from "redis";

type RedisClient = ReturnType<typeof createClient>;

type GlobalRedis = {
    redisClient?: RedisClient;
    redisConnectPromise?: Promise<RedisClient>;
};

const globalRedis = globalThis as unknown as GlobalRedis;

export async function getRedisClient() {
    const url = process.env.REDIS_URL;
    if (!url) throw new Error("REDIS_URL is not set");

    if (globalRedis.redisClient?.isOpen) return globalRedis.redisClient;

    if (globalRedis.redisConnectPromise) {
        return await globalRedis.redisConnectPromise;
    }

    const client =
        globalRedis.redisClient ??
        createClient({
            url,
            socket: {
                reconnectStrategy: (retries) => {
                    const baseDelay = Math.min(100 * 2 ** retries, 30_000);
                    const jitter = Math.floor(Math.random() * 200);
                    return baseDelay + jitter;
                },
            },
        });

    if (client !== globalRedis.redisClient) {
        client.on("error", (error) => {
            console.error("Redis client error", error);
        });
        globalRedis.redisClient = client;
    }

    globalRedis.redisConnectPromise = client
        .connect()
        .then(() => client)
        .catch((error) => {
            globalRedis.redisClient = undefined;
            throw error;
        })
        .finally(() => {
            globalRedis.redisConnectPromise = undefined;
        });

    return await globalRedis.redisConnectPromise;
}
