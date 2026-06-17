import { MongoClient, Db } from "mongodb";

type GlobalMongo = {
    mongoClient?: MongoClient;
    mongoConnectPromise?: Promise<MongoClient>;
};

const globalMongo = globalThis as unknown as GlobalMongo;

const DB_NAME = "portfolio";

/**
 * Returns a connected, cached MongoClient. Reuses a single client across
 * serverless invocations via globalThis so we don't exhaust connections.
 * MONGO_USER / MONGO_PASS are applied as auth options when present, so
 * MONGO_URL can be a bare host URI without embedded credentials.
 */
export async function getMongoClient(): Promise<MongoClient> {
    const url = process.env.MONGO_URL;
    if (!url) throw new Error("MONGO_URL is not set");

    if (globalMongo.mongoClient) return globalMongo.mongoClient;
    if (globalMongo.mongoConnectPromise)
        return await globalMongo.mongoConnectPromise;

    const user = process.env.MONGO_USER;
    const pass = process.env.MONGO_PASS;

    const client = new MongoClient(url, {
        ...(user && pass ? { auth: { username: user, password: pass } } : {}),
        maxPoolSize: 10,
        retryWrites: true,
    });

    globalMongo.mongoConnectPromise = client
        .connect()
        .then((connected) => {
            globalMongo.mongoClient = connected;
            return connected;
        })
        .catch((error) => {
            globalMongo.mongoClient = undefined;
            throw error;
        })
        .finally(() => {
            globalMongo.mongoConnectPromise = undefined;
        });

    return await globalMongo.mongoConnectPromise;
}

export async function getDb(): Promise<Db> {
    const client = await getMongoClient();
    return client.db(DB_NAME);
}
