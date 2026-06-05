const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI

let client = null;
let connectionPromise = null;

module.exports.connect = async () => {

    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!connectionPromise) {
        connectionPromise = mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 3000,
            connectTimeoutMS: 3000,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferCommands: false,
            maxPoolSize: 1,     
            minPoolSize: 1,   
            maxIdleTimeMS: 30000   
        }).then((m) => m.connection);
    }
    try {
        client = await connectionPromise;
        return client;
    } catch (err) {
        conectionPromise = null;
        console.error(err);
    }
}

module.exports.disconnect = async () => {
    try {
        await client.disconnect();
    } catch (err) {
        console.error(err);
    }
}