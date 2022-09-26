const express = require('express');
const { json } = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

const userRoutes = require('./user-routes');
const authRoutes = require('./auth-routes');

const apiLogger = require('../shared/log-util');
const connectDb = require('../shared/db-util');
const cache = require('../shared/redis-util');

dotenv.config();
const host = process.env.HOST;
const port = process.env.PORT;

connectDb('mongodb://localhost:27017/metadata', {}); // process.env.MONGO
cache.connect();

const app = express();
app.use(apiLogger);
app.use(json());
app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use((req, res, next) => {
    res.status(404).json({ message: 'Could not find resource' });
});
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ message: 'Internal software error' });
});

app.listen(port, host, () => {
    console.log(`Running authentication service on ${host}:${port}`);
});
