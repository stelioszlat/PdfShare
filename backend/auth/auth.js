const express = require('express');
const { json } = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const swagger = require('swagger-ui-express');
const prom = require('prom-client');

const userRoutes = require('./routes/user-routes');
const authRoutes = require('./routes/auth-routes');

const util = require('./util/util');
const swaggerConfig = require('./swagger.json');

dotenv.config();
const host = process.env.HOST;
const port = process.env.PORT;

util.connectDb(process.env.MONGO, {});
util.connectCache();

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
