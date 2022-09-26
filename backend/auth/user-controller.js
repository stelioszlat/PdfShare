const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./user');

exports.getUsers = async (req, res, next) => {
    // get all users
    try {
        const users = await User.find();

        if (!users) {
            return res.status(409).json({ message: 'Could not find users.' });
        }

        res.status(200).json({ users });
    
    } catch (err) {
        console.log(err);
        return next(err);
    }
};

exports.createUser = async (req, res, next) => {
    const { username, email, password, rePassword } = req.body;

    try {
        const existingUser = await User.findOne({
            username: username,
            email: email
        });

        if (existingUser) {
            res.status(409).json({ message: 'User already exists' });
        }

        if (password === rePassword) {
            res.status(409).json({ message: 'Re-entered password does not match' });
        }
        console.log('here');
        const hashedPassword = bcrypt.hash(password, 12);
        const user = new User({
            username: username,
            email: email,
            password: hashedPassword,
        });

        const result = await user.save();

        if (!result) {
            res.status(409).json({ message: 'Could not create user.' });
        }

        console.log(result);
        res.status(200).json({ result: result});

    } catch (err) {
        return next(err);
    }
};

exports.getUserById = async (req, res, next) => {
    const userId = req.params.uid;

    try {
        const user = await User.findById(userId);

        if (!user) {
            res.status(409).json({ message: 'User does not exist' });
        }

        res.status(200).json({user});
    
    } catch (err) {
        console.log(err);
        return next(err);
    }
};

exports.updateUserById = async (req, res, next) => {
    const userId = req.params.uid;

    try {
        const user = await User.findByIdAndDelete(userId);

        res.status(200).json({ user });
    
    } catch (err) {
        console.log(err);
        return next(err);
    }
};

exports.deleteUserById = async (req, res, next) => {
    const userId = req.params.uid;

    try {
        const user = await User.findByIdAndDelete(userId);

        res.status(200).json({ user });
    
    } catch (err) {
        console.log(err);
        return next(err);
    }
};

exports.hasValidId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.uid)) {
        return res.status(404).json({ message: 'Could not find user.' });
    }

    next();
}