const morgan = require('morgan');

exports.apiLogger = morgan(function (tokens, req, res) {
    return [
        '[API]',
        tokens.date(req, res),
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        // tokens['response-time'](req, res), 'ms'
    ].join(' ')
});