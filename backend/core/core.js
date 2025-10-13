const express = require('express');
const { json } = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const swagger = require('swagger-ui-express');
const prom = require('prom-client');

const metaRoutes = require('./routes/meta-routes');
const loggingRoutes = require('./routes/logging-routes');
const errorRoutes = require('./routes/error-routes');
const searchRoutes = require('./routes/search-routes');

const connectDb = require('./util/db-util');
const cache = require('./util/redis-util');
const apiLogger = require('./util/log-util');
// const { getInfo } = require('./util/elastic-util';
const { log } = require('./controllers/logging-controller');
const swaggerConfig = require('./swagger.json');
const{ connection, connectQueue } = require('./util/queue-util');

dotenv.config();
const port = process.env.PORT;

const app = express();
const register = new prom.Registry();
prom.collectDefaultMetrics({ register });

const httpRequestDuration = new prom.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const httpRequestCounter = new prom.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestCounter);

app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration.labels(req.method, req.route?.path || req.path, res.statusCode).observe(duration);
    httpRequestCounter.labels(req.method, req.route?.path || req.path, res.statusCode).inc();
  });
  
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.use(json());
app.use(apiLogger);
app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(log);
app.use('/api/metadata', metaRoutes);
app.use('/api/logging', loggingRoutes);
app.use('/api/search', searchRoutes);
app.use('/api-docs', swagger.serve, swagger.setup(swaggerConfig));
app.use(errorRoutes);

if (!connectQueue()) {
    console.error(`Could not connect to queue on ${process.env.QUEUE_HOST}`)
}

if (!cache.connect()) {
    console.error(`Could not connect to cache on ${process.env.REDIS_HOST}`)
}

if (!connectDb(process.env.MONGO, {})) {
    console.error(`Could not connect to database on ${process.env.MONGO}`)
}


app.listen(port, () => {
    console.log(`Running server on port ${port}`);
});

