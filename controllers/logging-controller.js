const Log = require('../models/log');

exports.log = async (req, res, next) => {
    try {
        const newLog = new Log({
            userName: req.username,
            logTime: new Date(),
            ipAddress: req.ip,
            url: req.originalUrl,
            authorization: req.header('Authorization')?.split(' ')[1],
            message: req.message
        });
    
        const newLogResult = await newLog.save();
        console.log(newLogResult);
    } catch(err) {
        console.log(err);
    } finally {
        next();
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
