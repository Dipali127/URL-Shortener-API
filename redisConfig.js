// const redis = require('redis');
// const redisClient = redis.createClient({
//     url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
// });


// module.exports = redisClient;

const redis = require('redis');

const redisClient = redis.createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

module.exports = redisClient;
