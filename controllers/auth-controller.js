const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const util = require('../util/auth-util');

const secret = process.env.SECRET; 

exports.login = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username) {
        return res.status(400).json({ message: 'You need to enter a username.'});
    }

    if (!password) {
        return res.status(400).json({ message: 'You need to enter a password.'});
    }

    try {
        let userFound = await User.findOne({
            username: username,
        });

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
