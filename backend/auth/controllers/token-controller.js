const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const User = require('../models/user-model');

dotenv.config();
const secret = process.env.SECRET;

exports.createTokenByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    try {
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ message: 'Could not find user' });
        }

        if (user.accessToken) {
            res.status(409).json({ message: 'User has already a token' });
        }

        // sign token
        const token = jwt.sign({
            email: user.email,
            username: user.username
        }, secret, { expiresIn: '1h' });

        const result = await User.findByIdAndUpdate(userId, {
            ...user,
            apiToken: token
        })

        if (!result) {
            res.status(409).json({ message: 'Could not create access token' })
        }

        res.status(200).json({ token });
        
    } catch (err) {
        return next(err);
    }
}

exports.getTokenByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    try {
        const user = await User.findById(userId);

        if (!user) {
            res.status(409).json({ message: 'Could not find user' });
        }

        res.status(200).json({ token: user.apiToken });

    } catch (err) {
        return next(err);
    }
};

exports.getTokens = async (req, res, next) => {
    let tokens = []
    try {
        const users = await User.find();
        console.log(users );
        for (let user in users) {
            tokens.push({
                username: user.username,
                token: user.apiToken
            });
        }
        
        res.status(200).json({ tokens });
    } catch (err) {
        return next(err);
    }
}