const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./user-model');
const util = require('./util');

const secret = process.env.SECRET;

const signToken = (user) => {
    return jwt.sign({
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin 
    }, secret, { expiresIn: '1h'});
}

exports.login = async (req, res, next) => {
    const { username, password } = req.body;

    const authHeader = req.get('Authorization')
    if (!authHeader) {
        return res.status(401).json({ message: 'No Authorization header found' });
    }

    const token = authHeader.split(' ')[1];
    if (!jwt.decode(token)) {
        return res.status(401).json({ message: 'Token not valid' });
    }

    const decodedToken = jwt.verify(token, secret);
    if (!decodedToken) {
        return res.status(401).json({ message: 'Not authenticated.' });
    }

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

        const token = signToken(userFound);
        await util.setToCache(username + '_token', token);
    
        res.status(200).json(token);
        
    } catch (err) {
        return next(err);
    }
};

// exports.logout = async (req, res, next) => {
//    
//
// }

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

        const token = signToken(username, email);
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
