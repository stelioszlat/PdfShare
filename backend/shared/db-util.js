const { connect } = require('mongoose');

const connectDb = (uri, options) => {
    try {
        connect(
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
    catch (err) {
        console.log({error: err});
    }
}

module.exports = connectDb;