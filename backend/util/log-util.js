const morgan = require('morgan');

const apiLogger = morgan(function (tokens, req, res) {
    return [
        '[API]',
        tokens.date(),
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        // tokens['response-time'](req, res), 'ms'
    ].join(' ')
});

module.exports = apiLogger;