const express = require('express');
const bodyParser = require('body-parser');

const { graphqlHTTP } = require('express-graphql');
const searchSchema = require('./graphql/schema');
const searchResolver = require('./graphql/resolvers');

const metaRoutes = require('./routes/meta-routes');
const loggingRoutes = require('./routes/logging-routes');
const editRoutes = require('./routes/edit-routes');
const searchRoutes = require('./routes/search-routes');
const userRoutes = require('./routes/user-routes');
const errorRoutes = require('./routes/error-routes');
const authRoutes = require('./routes/auth-routes');
const { authenticate } = require('./controllers/auth-controller');

const config = require('./config.json');
const db = require('./db/connect');
const cache = require('./cache/redis-util');

const host = config.host;
const port = config.port;

const app = express();
app.use(bodyParser.json());
// db.connect(config.mongo);
db.connect(config.mongotest);
cache.connect();

app.use('/api/metadata', metaRoutes);
app.use('/api/logging', loggingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/search', authenticate, graphqlHTTP({
    schema: searchSchema,
    rootValue: searchResolver,
    graphiql: true
}));
app.use(errorRoutes);

app.listen(port, host, () => {
    console.log(`Running server on ${host}:${port}`);
});
