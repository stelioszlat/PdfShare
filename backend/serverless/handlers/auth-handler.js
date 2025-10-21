const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { connect, disconnect } = require('../util/database');
const { response, error } = require('../util/response');
const { signToken } = require('../util/auth');

module.exports.login = async (event) => {
    const body = JSON.parse(event.body);
    const { username, password } = body;

    if (!username) {
        return response(400, { message: 'You need to enter a username.'});
    }

    if (!password) {
        return response(400, { message: 'You need to enter a password.'});
    }

    try {
        await connect();

        let userFound = await User.findOne({
            username: username,
        });

        if (!userFound) {
            return response(404, { message: 'Could not find user.' });
        }

        const isCorrect = await bcrypt.compare(password, userFound.password);
        if (!isCorrect) {
            return response(409, { message: 'Incorrect password' });
        }

        const token = signToken(userFound);

        const result = await User.findByIdAndUpdate(userFound._id, {
            apiToken: token,
            lastLogin: new Date().toISOString()
        });

        if (!result) {
            return response(409, { message: 'Could not update login info'});
        }
    
        return response(200, {
            access_token: token,
            isAdmin: userFound.isAdmin,
            userId: userFound._id 
        });
        
    } catch (err) {
        console.log(err);
        return error(err);
    } finally {
        await disconnect();
    }
}

exports.logout = async (event) => {
    const { username } = event.body;

    if (!username) {
        return response(400, { message: 'You need to enter a username' });
    }

    try {
        await connect();

        const userFound = await User.findOne({
            username: username
        });

        if (!userFound) {
            return response(404, { message: 'Could not find user.' });
        }

        response(200, { message: 'User is logged out.' });
        
    } catch (err) {
        console.error(err);
        return error(err);
    } finally {
        await disconnect();
    }
}

exports.reset = async (event) => {
    const body = JSON.parse(event.body);
    const { email, oldPassword, newPassword } = body; 

    if (!email) {
        return response(400, { message: 'You need to enter an email.' });
    }

    try {
        await connect();
        
        const userFound = await User.findOne({
            email: email,
        });

        if (!userFound) {
            return response(404, { message: 'Could not find user.' });
        }

        if (!oldPassword) {
            return response(400, { message: 'You need to enter your old password.'});
        }

        if (!newPassword) {
            return response(400, { message: 'You need to enter a new password' });
        }

        if (oldPassword === newPassword) {
            return response(409, { message: 'You need to enter a different password' });
        }

        const isCorrect = await bcrypt.compare(oldPassword, userFound.password);
        if (!isCorrect) {
            return response(409, { message: 'Incorrect password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        const user = await User.findByIdAndUpdate(userFound.id, {
            password: hashedPassword,
        });
    
        if (!user) {
            return response(409, { message: 'Could not reset password'});
        }

        response(200, { message: 'Your password has been changed' });
        
    } catch (err) {
        console.error(err);
        return error(err);
    } finally {
        await disconnect();
    }
} 

module.exports.register = async (event) => {
    const body = JSON.parse(event.body);
    const { email, username, password, rePassword } = body;

    if (!email) {
        return response(409, { message: 'You need to enter email'});
    }

    if (!username) {
        return response(409, { message: 'You need to enter username'});
    }

    if (!password) {
        return response(409, { message: 'You need to enter password'});
    }

    if (!rePassword) {
        return response(409, { message: 'You need to re-enter password'});
    }

    if (password !== rePassword) {
        return response(409, { message: 'Re-entered password does not match' });
    }

    try {
        client.connect()

        const hashedPassword = await bcrypt.hash(password, 12);
        const secret = process.env.SECRET;

        const apiToken = jwt.sign({
            username: username,
            password: hashedPassword,
            isAdmin: false,
            active: true
        }, secret);

        const user = new User({
            username: username,
            email: email,
            active: true,
            password: hashedPassword,
            apiToken: apiToken
        });
    
        const result = await user.save();

        if (!result) {
            return response(409, { message: 'Could not create user.'});
        }

        const token = util.signToken(user);
        
       return response(200, { access_token: token, userId: result._id });

    } catch (err) {
        console.error(err);
        return error(err);
    } finally {
        await disconnect();
    }
}

exports.userExists = async (event) => {
    const body = JSON.parse(event.body);
    const { username, email } = body;

    if (!username) {
        return response(409, { message: 'You need to enter a username.' });
    }

    if (!email) {
        return response(409, { message: 'You need to enter an email.' });
    }

    try {
        await connect();

        const user = await User.find({
            username: username,
            email: email
        });

        if (user.length !== 0) {
            return response(409, { message: 'User already exists.' });
        }
        
    } catch (err) {
        console.error(err);
        return error(err);
    } finally {
        await disconnect();
    }
};