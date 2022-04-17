const mongoose = require('mongoose');

exports.connect = async (uri, options) => {
    try {
        await mongoose.connect(
            uri,
            {   
                ...options,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
            }
        );
        console.log("Connected to database");
    }
    catch (err){
        console.log({error: err});
        next(err);
    }
}