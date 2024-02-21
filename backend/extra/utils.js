const morgan = require('morgan');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();
const secret = process.env.SECRET;

exports.authenticate = async (req, res, next) => {
    if (process.env.NEEDS_AUTH === "false") {
        return next();
    }
    
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const authHeader = req.get('Authorization');
        if (!authHeader) {
            return res.status(401).json({ message: 'No Authorization header found' });
        }

        const token = authHeader.split(' ')[1];
        if (!jwt.decode(token)) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const decodedToken = jwt.verify(token, secret);
        if (!decodedToken) {
            return res.status(401).json({ message: 'Not authenticated.' });
        }

        if (decodedToken.isAdmin) {
            req.isAdmin = true;
        }
        
        next();
    } catch (err) {
        return next(err);
    }
};

exports.isAdmin = (req, res, next) => {
    if (process.env.NEEDS_AUTH) {
        return next();
    }
    
    if (!req.isAdmin) {
        return res.status(403).json({ message: "You are not authorized to access this resource" });
    }
    next();
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