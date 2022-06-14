const config = require('../config.json');
const client = require('redis').createClient({
    url: config.redis.url | "localhost:6379"
});

exports.connect = async () => {
    client.on('error', (err) => {
        console.log(err);
    });

    await client.connect();

    console.log("Connected to cache");
}

exports.cacheHealthCheck = async () => {
    return await client.exists().then(num => {
        return true;
    }).catch(err => {
        console.log('Redis client error.');
    });
}

exports.get = (key) => {
    return client.get(key);
}

exports.set = (key, value) => {
    return client.set(key, JSON.stringify(value));
}
