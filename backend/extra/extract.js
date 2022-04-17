const bodyParser = require('body-parser');
const express = require('express');
const multer = require('multer');

const extractRoutes = require('./extracting-routes');

const extract = express();
const port = 8082;
const host = "localhost";

const uploader = multer({ storage: multer.memoryStorage() });

extract.use(bodyParser.json());
extract.use('/api/extracting', extractRoutes);


extract.listen(port, host, () => {
    console.log(`Running extracting service on ${host}:${port}`)
});

// Run service on host:port

// Post a file on https://extract.pdfshare.io/api/extracting/extract

// Extract metadata from the file

// Send metadata to https://pdfshare.io/api/metadata/new
// this url should be dynamically passed into the service


