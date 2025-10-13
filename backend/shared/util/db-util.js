const { connect } = require('mongoose');
const os = require('os');

const connectDb = async (uri, options) => {
    let connected = false;
    try {
        await connect(uri, {   
            ...options,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });
        console.log("Connected to database on " + uri);
        connected = true
    } catch (err) {
        console.error(err);
    } finally {
        return connected
    }
}

module.exports = connectDb;