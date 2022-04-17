const Log = require('../models/log');

exports.createLog = async (req, res, next) => {
    const {creator, action, message} = req.body
    console.log({creator, action, message});

    const createdLog = Log({
        userName: creator,
        logTime: Date.now(),
        action: action,
        message: message
    });

    try {
        await createdLog.save();
        res.status(200).json({message: 'successful', createdLog});
    }
    catch(err){
        return next(err);
    }
};

exports.getLogs = async (req, res, next) => {
    
    const { from, to } = req.params;

    try {
        const logs = await Log.find({
            logTime: {$gte: from, $lte: to}
        });
        if (!logs) {
            return next('Could not find logs');
        }
        res.status(200).json(logs);
    } catch(err){
        return next(err);
    }
};

exports.getLogsByUser = async (req, res, next) => {
    const user = req.body.uid;

    try {
        const result = await Log.findOne({userName: user});
        if (!result) {
            return next('Could not find logs.');
        }
        res.status(200).json({result});
    } catch(err) {
        return next(err);
    }
}