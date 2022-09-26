// import config from '../config.json';
const { createClient } = require('redis');

const client = createClient({
    url: "redis://localhost:6379"
});

exports.connect = async () => {
    client.on('error', (err) => {
        console.log(err);
    });

    await client.connect();

    console.log("Connected to cache");
}

// export const cacheHealthCheck = (): boolean => {
//     client.exists().then((num: any) => {
//         return true;
//     }).catch((err: any) => {
//         console.log('Redis client error.');
//         return false;
//     });
// }

exports.get = (key) => {
    return client.get(key);
}

exports.set = (key, value) => {
    return client.set(key, JSON.stringify(value));
}
