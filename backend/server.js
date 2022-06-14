const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { graphqlHTTP } = require('express-graphql');
const searchSchema = require('./graphql/schema');
const searchResolver = require('./graphql/resolvers');

const metaRoutes = require('./routes/meta-routes');
const loggingRoutes = require('./routes/logging-routes');
const userRoutes = require('./routes/user-routes');
const errorRoutes = require('./routes/error-routes');
const authRoutes = require('./routes/auth-routes');
const searchRoutes = require('./routes/search-routes');
const { authenticate } = require('./controllers/auth-controller');
const { log } = require('./controllers/logging-controller');

const config = require('./config.json');
const db = require('./util/db-util');
const cache = require('./util/redis-util');
const apiLogger = require('./util/log-util');

const host = config.host;
const port = config.port;

const app = express();
app.use(bodyParser.json());
app.use(apiLogger);
app.use(cors());
// db.connect(config.mongo);
db.connect(config.mongotest);
cache.connect();

// app.use(log);
app.use('/api/metadata', metaRoutes);
app.use('/api/logging', loggingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/graphql/search/', graphqlHTTP({
    schema: searchSchema,
    rootValue: searchResolver,
    graphiql: true
}));
app.use(errorRoutes);

app.listen(port, host, () => {
    cache.set('user', 'stelios');
    console.log(`Running server on ${host}:${port}`);
});
