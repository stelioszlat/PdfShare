const mongoose = require('mongoose');
const User = require('../models/user');

const { connect, disconnect } = require('../util/database');
const { response, error } = require('../util/response');
const { signToken } = require('../util/auth');

const secret = process.env.SECRET;

module.exports.getUsers = async (event) => {
    try {
        await connect();

        const users = await User.find({}).select('-password');
    
        if (!users) {
            return response(404, { message: 'Could not find users.' });
        }
            
        return response(200, { users });
    } catch (err) {
        console.error(err);
        return error(err);
    } finally {
        await disconnect();
    }
}

module.exports.createUser = async (event) => {
    const body = JSON.parse(event.body);
    const { email, username, isAdmin, password, rePassword } = body;

    if (!email) {
        return response(409, { message: 'You need to enter email' });
    }

    if (!username) {
        return response(409, { message: 'You need to enter username' });
    }

    if (!password) {
        return response(409, { message: 'You need to enter password' });
    }

    if (!rePassword) {
        return response(409, { message: 'You need to re-enter password' });
    }

    if (password !== rePassword) {
        return response(409, { message: 'Re-entered password does not match' });
    }

    try {
        await connect();

        const existingUser = await User.findOne({
            username: username,
            email: email
        });

        if (existingUser) {
            return response(409, { message: 'User already exists' });
        }

        const apiToken = signToken(existingUser);

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            username: username,
            email: email,
            active: true,
            apiToken: apiToken,
            password: hashedPassword,
        });
    
        const result = await user.save();

        if (!result) {
            return response(409, { message: 'Could not create user.' });
        }
        
        return response(200, { user });
    } catch (err) {
        console.error(err);
        return error(err);
    } finally {
        await disconnect();
    }
}

module.exports.getUserById = async (event) => {
    let userId = event.pathParameters;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return response(404, { message: 'Could not find user.' });
    }

    try {
        await connect();

        const user = await User.findById(userId);

        if (!user) {
            response(404, { message: 'User does not exist' });
        }

        return response(200, { user });
    } catch (err) {
        console.error(err);
        return error(err);
    } finally {
        await disconnect();
    }
}

module.exports.updateUserById = async (event) => {
    const userId = event.pathParameters;
    const body = JSON.parse(event.body);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return response(404, { message: 'Could not find user.' });
    }

    try {
        await connect();

        const user = await User.findByIdAndUpdate(userId, {
            ...body
        });

        if (!user) {
            return response(404, { message: 'User does not exist' });
        }

        return response(200, { user });
    
    } catch (err) {
        console.error(err);
        return error(err);
    } finally {
        await disconnect();
    }
}


module.exports.deleteUserById = async (event) => {
    const userId = event.pathParameters;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return response(404, { message: 'Could not find user.' });
    }

    try {
        await connect();

        const user = await User.findByIdAndUpdate(userId, {});

        if (!user) {
            return response(404, { message: 'User does not exist' });
        }

        return response(200, { user });
    
    } catch (err) {
        console.error(err);
        return error(err);
    } finally {
        await disconnect();
    }
}
