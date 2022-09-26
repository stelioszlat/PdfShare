const jwt = require('jsonwebtoken');

const User = require('./user');

const secret = process.env.SECRET;

exports.createTokenByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    try {
        const user = await User.findById(userId);

        if (!user) {
            res.status(409).json({ message: 'Could not find user' });
        }

        if (user.accessToken) {
            res.status(409).json({ message: 'User has already a token' });
        }

        // sign token
        const token = jwt.sign({
            email: user.email,
            userId: user._id
        }, secret, { expiresIn: '1h'});

        const result = await User.findByIdAndUpdate(userId, {
            ...user,
            accessToken: token
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

        // sign token
        const token = jwt.sign({
            email: user.email,
            userId: user._id
        }, secret, { expiresIn: '1h'});

        res.status(200).json({ token });

    } catch (err) {
        return next(err);
    }
};

exports.getTokenExpiryByUserId = async (req, res, next) => {
    // get expiration date of a token
    const userId = req.params.uid;

    try {

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Could not find user.'});
        }

        const tokenExpiry = user.tokenExpiry;
        if (!tokenExpiry) {
            return res.status(404).json({ message: 'Could not find token.'});
        }

        if(Date.now().toString() > tokenExpiry) {
            res.status(200).json({ tokenExpiry, expired: true});
        }

    } catch(err) {
        return next(err);
    }

    // check if token has expired
};

exports.refreshTokenByUserId = async (req, res, next) => {
    // extend the active time of a token

};