const Log = require('../models/log');

exports.createLog = async (req, res, next) => {
    
    try {
        persistLog(req);

        res.status(204).json();
    } catch(err){
        return next(err);
    }
};

exports.getLogs = async (req, res, next) => {
    
    const { 
        from, 
        to,
        user,

    } = req.query;

    try {

        let logs = await Log.find();//{
            // logTime: {$gte: from, $lte: to},
            // userName: user
        // });

        if (!logs) {
            return res.status(404).json({ message: 'Could not find logs' });
        }

        res.status(200).json(logs);

    } catch(err){
        return next(err);
    }
};

exports.getLogsByUser = async (req, res, next) => {

    const userId = req.body.uid;

    try {
        const result = await Log.findById(userId);

        if (!result) {
            return res.status(404).json({ message: 'Could not find logs.' });
        }

        res.status(200).json({ result });

    } catch(err) {
        return next(err);
    }
}

exports.log = async (req, res, next) => {

    try {
        persistLog(req);
    } catch(err) {
        console.log('Could not log action.');
    }

    next();
}

const persistLog = async (req) => {
    const newLog = new Log({
        ipAddress: req.ip,
        requestUril: req.originalUrl,
        authorization: req.get('Authorization'),
    });

    try {
        await newLog.save();
    } catch (err) {
        console.log('Error while trying to log action: ' + newLog);
        throw new Error();
    }
}