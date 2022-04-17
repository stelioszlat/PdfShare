const express = require('express');
const User = require('../models/user');

exports.getUsers = async (req, res, next) => {
    // get all users
    try {
        const users = await User.find();

        if (!users) {
            return next('Could not find users.');
        }

        res.status(200).json({ users });
    
    } catch (err) {
        console.log(err);
        return next(err);
    }
};

exports.createUser = async (req, res, next) => {
    const { name, email, password, rePassword } = req.body;

    try {
        const existingUser = await User.findOne({
            email: email
        });

        if (existingUser) {
            res.status(409);
            return next('User already exists');
        }

        if (password === rePassword) {
            res.status(409);
            return next('Re-entered password does not match');
        }

        const hashedPassword = bcrypt.hash(password, 12);
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
        });

        const result = await user.save();

        if (!result) {
            res.status(409);
            return next('Could not create user.');
        }

        console.log(result);
        res.status(200).json({ message: 'Created user', result: result});

    } catch (err) {
        return next(err);
    }
};

exports.getUserById = async (req, res, next) => {
    const userId = req.params.uid;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return next('User does not exist');
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

        res.status(200).json({user});
    
    } catch (err) {
        console.log(err);
        return next(err);
    }
};

exports.deleteUserById = async (req, res, next) => {
    const userId = req.params.uid;

    try {
        const user = await User.findByIdAndDelete(userId);

        res.status(200).json({user});
    
    } catch (err) {
        console.log(err);
        return next(err);
    }
};