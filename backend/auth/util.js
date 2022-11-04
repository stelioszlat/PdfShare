const { connect } = require('mongoose');
const { createClient } = require('redis');
const morgan = require('morgan');
const dotenv = require('dotenv');

const User = require('./user-model');

dotenv.config();
const host = process.env.REDIS_HOST;

const client = createClient({
    url: host
});

exports.connectDb = (uri, options) => {
    connect(uri, {   
        ...options,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(value => {
        console.log("Connected to database on " + uri);
    }).catch(err => {
        console.log({error: err});
    });
}

exports.connectCache = async () => {
    client.on('error', (err) => {
        console.log(err);
    });

    await client.connect().then(() => { console.log("Connected to cache on " + host) });
}

exports.getFromCache = async (key) => {
    return await client.get(key);
}

exports.setToCache = async (key, value) => {
    return await client.set(key, JSON.stringify(value));
}

exports.apiLogger = morgan(function (tokens, req, res) {
    return [
        '[API]',
        tokens.date(req, res),
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        // tokens['response-time'](req, res), 'ms'
    ].join(' ')
});

exports.userExists = async (req, res, next) => {
    // check if user exists
    const userEmail = req.body.email;

    try {

        const user = await User.find({
            email: userEmail
        });

        if (user.length !== 0) {
            return res.status(409).json({ message: 'User already exists.' });
        }

    } catch (err) {
        return next(err);
    }

    next();
}

exports.userHasToken = async (req, res, next) => {
    // check if user has active token
    const userId = req.params.uid;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(409).json({ message: 'Could not find user.' });
        }

        if (user.token) {
            return res.status(409).json({ message: 'User has already a token.'});
        }

    } catch (err) {
        return next(err);
    }

    next();
}


