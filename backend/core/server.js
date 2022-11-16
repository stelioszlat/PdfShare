const express = require('express');
const { json } = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const swagger = require('swagger-ui-express');

const metaRoutes = require('./routes/meta-routes');
const loggingRoutes = require('./routes/logging-routes');
const errorRoutes = require('./routes/error-routes');
const searchRoutes = require('./routes/search-routes');
const settingsRoutes = require('./routes/settings-routes');

const connectDb = require('./util/db-util');
const cache = require('./util/redis-util');
const apiLogger = require('./util/log-util');
const { authenticate, isAdmin } = require('./util/auth-util');
const swaggerConfig = require('./swagger.json');

dotenv.config();
const host = process.env.HOST;
const port = process.env.PORT;

const app = express();
app.use(json());
app.use(apiLogger);
app.use(cors());

// app.use(log);
app.use('/api/metadata', authenticate, isAdmin, metaRoutes);
app.use('/api/logging', loggingRoutes);
app.use('/api/search', authenticate, searchRoutes);
app.use('/api/settings', authenticate, settingsRoutes);
app.use('/api-docs', authenticate, swagger.serve, swagger.setup(swaggerConfig));
app.use(errorRoutes);


app.listen(port, host, () => {
    if (process.env.ENVIRONMENT === "testing") {
        connectDb(process.env.MONGO_TEST, {});
    } else {
        connectDb(process.env.MONGO, {});
    }

    cache.connect();
    console.log(`Running server on ${host}:${port}`);
});
