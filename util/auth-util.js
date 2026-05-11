const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Metadata = require('../models/metadata');

dotenv.config();
const secret = process.env.SECRET;

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

exports.signToken = (user) => {
    return jwt.sign({
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin 
    }, secret, { expiresIn: '1h'});
}

exports.authenticate = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const authHeader = req.get('Authorization')
        if (!authHeader) {
            return res.status(401).json({ message: 'No Authorization header found' });
        }

        const token = authHeader.split(' ')[1];
        if (!jwt.decode(token)) {
            return res.status(401).json({ message: 'Invalid Token' });
        }

        const decodedToken = jwt.verify(token, secret);
        if (!decodedToken) {
            return res.status(401).json({ message: 'Not authenticated.' });
        }

        if (decodedToken.isAdmin) {
            req.isAdmin = true;
        }

        if (decodedToken.username) {
            req.username = decodedToken.username;
        }
        
        next();
    } catch (err) {
        return next(err);
    }
};

exports.isAdmin = (req, res, next) => {
    if (!req.isAdmin) {
        return res.status(403).json({ message: "You are not authorized to access this resource" });
    }
    next();
}

exports.isSelf = async (req, res, next) => {
    const userId = req.param.userId;
    if (userId) {
        try {
            const user = await User.findById(userId);

            if (!(user.username === req.username)) {
                return res.status(403).json({ message: "You are not authorized to access this resource (self)" });
            }
        } catch (err) {
            return next(err);
        }
    }
    next();
}

exports.isSelfOrAdmin = async (req, res, next) => {
    const userId = req.param.userId;
    if (userId) {
        try {
            const user = await User.findById(userId);

            if (!(user.username === req.username) || !req.isAdmin) {
                return res.status(403).json({ message: "You are not authorized to access this resource (self or admin)" });
            }
        } catch (err) {
            return next(err);
        }
    }
    next();
}

exports.isOwnerOrAdmin = async (req, res, next) => {
    const fileId = req.param.fid;
    if (fileId) {
        try {
            const file = await Metadata.findById(fileId);
            
            if (!(file.uploaderUsername === req.username) || !req.isAdmin) {
                return res.status(403).json({ message: "You are not authorized to access this resource (owner or admin)" });
            }
        } catch (err) {
            return next(err);
        }
    }
    next();
}