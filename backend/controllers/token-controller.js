const express = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.createTokenByUserId = async (req, res, next) => {

}

exports.getTokenByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return next('Could not find user');
        }

        // sign token
        const token = jwt.sign({
            email: user.email,
            userId: user._id
        }, 'secret', { expiresIn: '1h'});

        res.status(200).json({ token });

    } catch (err) {
        return next(err);
    }
};

exports.getTokenExpiryByUserId = async (req, res, next) => {
    // get expiration date of a token

    // check if token has expired
};

exports.renewTokenByUserId = async (req, res, next) => {
    // extend the active time of a token

};