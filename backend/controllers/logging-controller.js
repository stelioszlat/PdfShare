
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
    // return all logs
    try {
        const result = await Log.find();
        res.status(200).json({result});
    }
    catch(err){
        return next(err);
    }
};

exports.getLogsFrom = async (req, res, next) => {
    const from = req.body.from;
    res.json({from});
    return next();
};

exports.getLogsFromTo = async (req, res, next) => {
    const {from, to} = req.body;
    res.json({from, to});
    return next();
};

exports.getLogsByUser = async (req, res, next) => {
    const user = req.body.uid;

    try {
        const result = await Log.findOne({userName: user});
        if (result !== undefined) {
            res.status(200).json({result});
        }
        res.status(500).json({message: "Could not find logs"});
    }
    catch(err) {
        return next(err);
    }
}