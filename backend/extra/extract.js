const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');

const apiLogger = require('../shared/log-util');
const cache = require('../shared/redis-util');
const extractRoutes = require('./extracting-routes');

const extract = express();
const port = 8082;
const host = "localhost";

cache.connect();

extract.use(cors());
extract.use(bodyParser.json());
extract.use(apiLogger);
extract.use('/api/extract', extractRoutes);

extract.listen(port, host, () => {
    console.log(`Running extracting service on ${host}:${port}`);
});

// Run service on host:port

// Post a file on https://extract.pdfshare.io/api/extracting/extract

// Extract metadata from the file

// Send metadata to https://pdfshare.io/api/metadata/new
// this url should be dynamically passed into the service


