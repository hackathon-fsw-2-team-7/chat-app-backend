const {createClient} = require("redis");

const redisClient = async () => {
    const client = createClient({
        password: process.env.REDIS_PASSWORD,
        socket: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
        },
    });
    await client.connect();
    return client;
};

async function getData(key) {
    const client = await redisClient();

    if (!client.isReady) {
        throw new Error("Failed connecting to Redis!");
    }
    const rawData = await client.get(key);
    const data = JSON.parse(rawData);
    await client.disconnect();

    return data;
}

async function setData(key, newData) {
    const client = await redisClient();

    if (!client.isReady) {
        throw new Error("Failed connecting to Redis!");
    }
    await client.set(key, JSON.stringify(newData), {
        EX: 180,
    });
    await client.disconnect();
}

async function deleteData(key) {
    const client = await redisClient();

    if (!client.isReady) {
        throw new Error("Failed connecting to Redis!");
    }
    await client.del(key);
    await client.disconnect();
}

module.exports = {getData, setData, deleteData};
