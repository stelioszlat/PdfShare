const mongoose = require('mongoose');

exports.connect = async function connect(uri, options){
    console.log("Establishing connection...");
    try {
        await mongoose.connect(
            uri,
            {   
                ...options,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log("Connected to database");
    }
    catch (err){
        console.log({error: err});
        next(err);
    }
}