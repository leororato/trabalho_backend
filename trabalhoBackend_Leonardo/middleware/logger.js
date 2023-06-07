const logger = (req, res, next) => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${(new Date()).toISOString()}`)
    next();
}

module.exports = logger;