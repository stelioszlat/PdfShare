const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user-model');
const util = require('../util/util');

const secret = process.env.SECRET;
const useCache = process.env.USE_CACHE === 'true';

exports.login = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username) {
        return res.status(400).json({ message: 'You need to enter a username.'});
    }

    if (!password) {
        return res.status(400).json({ message: 'You need to enter a password.'});
    }

    try {
        let userFound;
        if (useCache) {
            userFound = await util.get(username);
        }

        if (!userFound) {
            userFound = await User.findOne({
                username: username,
            });
        }

        if (!userFound) {
            return res.status(404).json({ message: 'Could not find user.' });
        }

        const isCorrect = await bcrypt.compare(password, userFound.password);
        if (!isCorrect) {
            return res.status(409).json({ message: 'Incorrect password' });
        }

        const token = util.signToken(userFound);

        const result = await User.findByIdAndUpdate(userFound._id.toString(), {
            apiToken: token,
            lastLogin: new Date().toISOString()
        });

        if (!result) {
            return res.status(409).json({ message: 'Could not update login info'});
        }

        if (useCache) {
            await util.set(username + '_token', token);
            await util.set(userFound._id.toString(), userFound);
            await util.set(username, userFound);
        }

        res.status(200).json({
            access_token: token,
            isAdmin: userFound.isAdmin,
            userId: userFound._id.toString()
        });
        
    } catch (err) {
        return next(err);
    }
};

exports.logout = async (req, res, next) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: 'You need to enter a username' });
    }

    try {
        const userFound = await User.findOne({
            username: username
        });

        if (!userFound) {
            return res.status(404).json({ message: 'Could not find user.' });
        }

        await util.delete(username + '_token');
        await util.delete(userFound._id.toString());
        await util.delete(username);

        return res.status(200).json({ message: 'User is logged out.' });
        
    } catch (err) {
        return next(err);
    }
}

exports.reset = async (req, res, next) => {
    const { email, newPassword } = req.body; 

    if (!email) {
        return res.status(400).json({ message: 'You need to enter an email'});
    }

    try {
        const userFound = await User.findOne({
            email: email,
        });

        if (!userFound) {
            return res.status(404).json({ message: 'Could not find user.' });
        }

        if (!newPassword) {
            return res.status(400).json({ message: 'You need to enter a new password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        const user = await User.findByIdAndUpdate(userFound.id, {
            password: hashedPassword,
        });
    
        if (!user) {
            return res.status(409).json({ message: 'Could not reset password'});
        }

        res.status(200).json({ message: 'Your password has been changed' });
        
    } catch (err) {
        return next(err);
    }
} 

exports.register = async (req, res, next) => {

    const { email, username, password, rePassword } = req.body;

    if (!email) {
        return res.status(409).json({ message: 'You need to enter email'});
    }

    if (!username) {
        return res.status(409).json({ message: 'You need to enter username'});
    }

    if (!password) {
        return res.status(409).json({ message: 'You need to enter password'});
    }

    if (!rePassword) {
        return res.status(409).json({ message: 'You need to re-enter password'});
    }

    if (password !== rePassword) {
        return res.status(409).json({ message: 'Re-entered password does not match' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            username: username,
            email: email,
            active: true,
            password: hashedPassword,
        });

        const apiToken = jwt.sign({
            userId: user._id.toString(),
            email: email,
            username: username,
            isAdmin: false,
            active: true
        }, secret);

        user.apiToken = apiToken;
    
        const result = await user.save();

        if (!result) {
            return res.status(409).json({ message: 'Could not create user.'});
        }

        const token = util.signToken(user);
        await util.set(username + '_token', token);
        await util.set(user._id.toString(), user);
        await util.set(username, user);
        
        res.status(200).json({ access_token: token, userId: result._id.toString() });

    } catch (err) {
        console.error(err);
        return next(err);
    }
};

exports.userExists = async (req, res, next) => {
    // check if user exists
    const { username, email } = req.body;

    if (!username) {
        return res.status(409).json({ message: 'You need to enter a username' });
    }

    if (!email) {
        return res.status(409).json({ message: 'You need to enter an email' });
    }

    try {

        const cachedUser = await util.get(username);

        if (cachedUser) {
            return res.status(409).json({ message: 'User already exists. (cached)' });
        }

        const user = await User.find({
            username: username,
            email: email
        });

        if (user.length !== 0) {
            return res.status(409).json({ message: 'User already exists.' });
        }
        
    } catch (err) {
        return next(err);
    }

    next();
};
