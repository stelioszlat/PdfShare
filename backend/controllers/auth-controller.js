const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    const authHeader = req.get('Authorization');
    
    if (authHeader) {
        authHeader.split(' ')[1];
    }
    
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'secret');
    } catch (err) {
        res.status(401);
        return next(err);
    }

    if (!decodedToken) {
        res.status(401);
        return next('Not Authenticated user.');
    }
    
    req.userId = decodedToken;
    next();
}

exports.login = async (req, res, next) => {

    let user = {...req.body};

    try {
        user = await User.findOne({
            name: user.name,
            email: user.email
        });
        console.log(user);
        if (!user) {
            return next('User not found.');
        }
    } catch (err) {
        return next(err);
    }

    const token = jwt.sign({
        email: user.email,
        userId: user._id
    }, 'secret', { expiresIn: '1h'});

    res.status(200).json({ token: token });
};

exports.register = async (req, res, next) => {
    // register to the users directory

    const { name, email, password, rePassword } = req.body;

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
    try {
        const result = await user.save();

        if (!result) {
            res.status(409);
            return next('Could not create user.');
        }

        console.log(result);
        res.status(200).json({ message: 'Registered'});

    } catch (err) {
        return next(err);
    }

};
