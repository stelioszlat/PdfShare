const client = require('redis').createClient();
const config = require('../config.json');

exports.connect = async () => {
    client.on('error', (err) => {
        console.log("Redis error: " + err);
    });

    await client.connect();

    console.log("Connected to cache");
}

exports.cacheHealthCheck = async () => {
    return await client.exists();
}

exports.get = (key) => {}

exports.set = (key, value) => {}