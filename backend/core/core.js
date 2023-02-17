const express = require('express');
const { json } = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const swagger = require('swagger-ui-express');
const os = require('os');

const metaRoutes = require('./routes/meta-routes');
const loggingRoutes = require('./routes/logging-routes');
const errorRoutes = require('./routes/error-routes');
const searchRoutes = require('./routes/search-routes');

const connectDb = require('./util/db-util');
const cache = require('./util/redis-util');
const apiLogger = require('./util/log-util');
const { log } = require('./controllers/logging-controller');
const swaggerConfig = require('./swagger.json');

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
app.use('/api-docs', swagger.serve, swagger.setup(swaggerConfig));
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
    console.log('Host: ' + os.hostname());
}).catch(err => {
    console.log(err);
});
