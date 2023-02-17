const express = require('express');
const { json } = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const swagger = require('swagger-ui-express');
const os = require('os');

const metaRoutes = require('./core/routes/meta-routes');
const loggingRoutes = require('./core/routes/logging-routes');
const errorRoutes = require('./core/routes/error-routes');
const searchRoutes = require('./core/routes/search-routes');
const authRoutes = require('./auth/routes/auth-routes');
const userRoutes = require('./auth/routes/user-routes');
const { extract, uploader } = require('./extra/extract');

const connectDb = require('./core/util/db-util');
const cache = require('./core/util/redis-util');
const apiLogger = require('./core/util/log-util');
const { getInfo } = require('./core/util/elastic-util');
const { log } = require('./core/controllers/logging-controller');
// const swaggerConfig = require('./swagger.json');

dotenv.config();
const host = process.env.HOST;
const port = process.env.PORT;

const app = express();
app.use(json());
app.use(apiLogger);
app.use(cors());

app.use(log);
app.use('/api/metadata', metaRoutes);
app.use('/api/logging', loggingRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/extract', uploader.single('file'), extract);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
// app.use('/api-docs', swagger.serve, swagger.setup(swaggerConfig));
app.use(errorRoutes);

cache.connect().then(() => {
    if (process.env.ENVIRONMENT === "testing") {
        connectDb(process.env.MONGO_TEST, {});
    } else {
        connectDb(process.env.MONGO, {});
    }
    app.listen(port, host, () => {
        console.log(`Running server on ${host}:${port}`);
    });
    getInfo();
    console.log('Host: ' + os.hostname());
}).catch(err => {
    console.log(err);
});