const { connect, set } = require('mongoose');

const connectDb = (uri, options) => {
    set('strictQuery', false);
    connect(uri, {   
        ...options,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(value => {
        console.log("Connected to database on " + uri);
    }).catch(err => {
        console.log({error: err});
    });
}

module.exports = connectDb;