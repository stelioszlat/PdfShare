const express = require('express');
const { json } = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const swagger = require('swagger-ui-express');

const userRoutes = require('./user-routes');
const authRoutes = require('./auth-routes');

const util = require('./util');
const swaggerConfig = require('./swagger.json');

dotenv.config();
const host = process.env.HOST;
const port = process.env.PORT;

util.connectDb(process.env.MONGO, {});
util.connectCache();

const app = express();
app.use(util.apiLogger);
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
app.use('/api/user', userRoutes);
app.use('/api-docs', swagger.serve, swagger.setup(swaggerConfig));
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
