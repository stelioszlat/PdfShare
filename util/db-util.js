const { connect } = require('mongoose');

const connectDb = (uri, options) => {
    connect(uri, {   
        ...options,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    }).then(value => {
        console.log("Connected to database on " + uri);
    }).catch(err => {
        console.log({error: err});
    });
}

module.exports = connectDb;