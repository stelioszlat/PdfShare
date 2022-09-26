"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const log_util_1 = __importDefault(require("../shared/log-util"));
const redis_util_1 = __importDefault(require("../shared/redis-util"));
const extracting_routes_1 = __importDefault(require("./extracting-routes"));
const extract = (0, express_1.default)();
const port = 8082;
const host = "localhost";
redis_util_1.default.connect();
extract.use((0, cors_1.default)());
extract.use(body_parser_1.default.json());
extract.use(log_util_1.default);
extract.use('/api/extract', extracting_routes_1.default);
extract.listen(port, host, () => {
    console.log(`Running extracting service on ${host}:${port}`);
});
// Run service on host:port
// Post a file on https://extract.pdfshare.io/api/extracting/extract
// Extract metadata from the file
// Send metadata to https://pdfshare.io/api/metadata/new
// this url should be dynamically passed into the service
