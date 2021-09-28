const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const metaRoutes = require('./routes/meta-routes');
const loggingRoutes = require('./routes/logging-routes');
const indexRoutes = require('./routes/index-routes');
const errorRoutes = require('./routes/error-routes');
const { connect } = require('./db/connect');

const app = express();
const connection = connect("mongodb://localhost:27017/database");

const port = 8080;

app.use(bodyParser.json())
app.use(express.static('/public'));

app.get('/', (req, res, next)=>{
    res.sendFile(path.join(__dirname, '../', 'frontend', 'public', 'index.html'));
});

app.use('/api/metadata', metaRoutes);
app.use('/api/logging', loggingRoutes);
app.use('/api/indexing', indexRoutes);
app.use(errorRoutes);

app.listen(port, () => {
    console.log("Running server on " + 8080);
});
