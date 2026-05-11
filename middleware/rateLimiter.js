const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,   // 1 Minute
    max: 7,                    // Max 7 requests per minute per IP/user
    message: {
        status: false,
        message: "Too many requests. Please try again after a minute."
    },
    standardHeaders: true,     
    legacyHeaders: false
});

module.exports = rateLimiter;
