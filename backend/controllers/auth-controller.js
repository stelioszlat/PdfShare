const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const auth = require('express-basic-auth');
const { secret } = require('../config.json');

exports.authenticate = (req, res, next) => {
    const authHeader = req.get('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ message: 'No Authorization header found.' });
    }

    const token = authHeader.split(' ')[1];

    if (!jwt.decode(token)) {
        return res.status(401).json({ message: 'Token not valid.'});
    }   

    const decodedToken = jwt.verify(token, secret);

    if (!decodedToken) {
        return res.status(401).json({ message: 'Not authenticated.' });
    }

    req.token = token;
    next();
}

exports.login = async (req, res, next) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(401).json({ message: 'Enter username or password.'});
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        console.log(hashedPassword);
        const userFound = await User.findOne({
            username: username,
            password: hashedPassword
        });

        if (!userFound) {
            return res.status(404).json({ message: 'Could not find user.' });
        }
        
    } catch (err) {
        return next(err);
    }

    const token = jwt.sign({
        username: user.username,
        email: user.email
    }, secret, { expiresIn: '15m'});

    res.status(200).json(token);
};

exports.register = async (req, res, next) => {

    const { name, email, password, rePassword } = req.body;

    if (!email) {
        return res.status(409).json({ message: 'You need to enter email'});
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
            name: name,
            email: email,
            password: hashedPassword,
        });
    
        const result = await user.save();

        if (!result) {
            return res.status(409).json({ message: 'Could not create user.'});
        }

        console.log(result);
        res.status(200).json({ message: 'Registered'});

    } catch (err) {
        return next(err);
    }
};
