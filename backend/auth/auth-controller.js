const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./user-model');
const util = require('./util');

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
        const hashedPassword = await bcrypt.hash(password, 12);

        const userFound = await User.findOne({
            username: username,
            password: hashedPassword
        });

        if (!userFound) {
            return res.status(404).json({ message: 'Could not find user.' });
        }

        const token = util.signToken(userFound);
        await util.setToCache(username + '_token', token);
    
        res.status(200).json({
            access_token: token
        });
        
    } catch (err) {
        return next(err);
    }
};

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
            password: hashedPassword,
        });
    
        const result = await user.save();

        if (!result) {
            return res.status(409).json({ message: 'Could not create user.'});
        }

        const token = util.signToken(user);
        await util.setToCache(username + '_token', token);
        
        res.status(200).json(token);

    } catch (err) {
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
