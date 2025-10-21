const jwt = require('jsonwebtoken');

module.exports.signToken = (user) => {
    const secret = process.env.SECRET;
    return jwt.sign({
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin 
    }, secret, { expiresIn: '1h'});
}