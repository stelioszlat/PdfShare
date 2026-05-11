const Log = require('../models/log');

exports.log = async (req, res, next) => {
    try {
        const newLog = new Log({
            userName: req.username,
            logTime: new Date(),
            ipAddress: req.ip,
            url: req.originalUrl,
            method: req.method,
            authorization: req.header('Authorization')?.split(' ')[1],
            authorization: req.header('Authorization')?.split(' ')[1],
            message: req.message
        });
    
        await newLog.save();
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
        url,
        ipAddress,
        page,
        limit
    } = req.query;

    let filter = {};

    if (from) {
        filter.logTime = { $gte: new Date(from) };
    }

    if (to) {
        filter.logTime = { $lte: new Date(to) };
    }

    if (from && to) {
        filter.logTime = { $gte: new Date(from), $lte: new Date(to) };
    }

    if (username) {
        filter.username = { $regex: username, $options: 'i' };
    }

    if (url) {
        filter.url = { $regex: url, $options: 'i' };
    }

    if (ipAddress) {
        filter.ipAddress = { $regex: ipAddress, $options: 'i' };
    }

    try {

        let logs = await Log.find(filter)
            .limit(+limit)
            .skip((+page - 1) * +limit)
            .exec()

        let count = await Log.countDocuments();

        if (!logs || logs.length === 0) {
            return res.status(404).json({ message: 'Could not find logs' });
        }

        let totalPages = 1;
        if (page) {
            totalPages = Math.ceil(count / limit);
        }

        res.status(200).json({  
            page, 
            limit,
            results: logs.length, 
            count,
            totalPages,
            logs
        });

    } catch(err){
        return next(err);
    }
};
