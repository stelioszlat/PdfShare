const express = require('express');
const User = require('../models/user');

exports.userExists = async (req, res, next) => {
    // check if user exists
    const userId = req.params.uid;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return next('Could not find user.');
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
            return next('Could not find user');
        }

        res.status(200).json({
            accessToken: user.token
        });
    } catch (err) {
        return next(err);
    }

    next();
}