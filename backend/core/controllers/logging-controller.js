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
        username,
        ipAddress,
        page,
        limit
    } = req.query;

    try {

        let logs = await Log.find(
            // {
            // logTime: { $gte: from, $lte: to },
            // userName: username,
            // ipAddress: ipAddress
            // }
        ).limit(+limit).skip((+page - 1) * +limit).exec();

        let count = await Log.countDocuments();

        if (!logs) {
            return res.status(404).json({ message: 'Could not find logs' });
        }

        res.status(200).json({  
            page, 
            limit, 
            count,
            totalPages: Math.ceil(count / limit),
            logs
        });

    } catch(err){
        return next(err);
    }
};

const persistLog = async (req) => {
    const newLog = new Log({
        userName: req.username,
        logTime: new Date(),
        ipAddress: req.ip,
        url: req.originalUrl,
        authorization: req.get('Authorization'),
        message: req.message
    });

    try {
        await newLog.save();
    } catch (err) {
        console.log('Error while trying to log action: ' + newLog);
        throw new Error();
    }
}