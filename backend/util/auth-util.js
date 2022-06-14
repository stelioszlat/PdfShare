const express = require('express');
const User = require('../models/user');

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