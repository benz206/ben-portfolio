import { createClient } from "redis";

type RedisClient = ReturnType<typeof createClient>;

type GlobalRedis = {
    redisClient?: RedisClient;
};

const globalRedis = globalThis as unknown as GlobalRedis;

export async function getRedisClient() {
    if (!globalRedis.redisClient || !globalRedis.redisClient.isOpen) {
        const client = createClient({ url: process.env.REDIS_URL });
        client.on("error", (error) => {
            console.error("Redis client error", error);
        });
        globalRedis.redisClient = client;
        try {
            await client.connect();
        } catch (error) {
            globalRedis.redisClient = undefined;
            throw error;
        }
    }

    return globalRedis.redisClient;
}
