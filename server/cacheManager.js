'use strict';

const redis = require('redis');
const { promisify } = require('util');
const config = require('./config/config')

console.log('Creating redis client');
const redisClient = redis.createClient(
  {
      host: config.redis_host,
      port: config.redis_port
  }
);
const password = config.redis_password || null;
if (password && password != 'null') {
  console.log('Signing in to redis');
  redisClient.auth(password, (err, res) => {
      console.log('res', res);
      console.log('err', err);
  });
}

try {
    redisClient.getAsync = promisify(redisClient.get).bind(redisClient);
    redisClient.setAsync = promisify(redisClient.set).bind(redisClient);
    redisClient.lpushAsync = promisify(redisClient.lpush).bind(redisClient);
    redisClient.lrangeAsync = promisify(redisClient.lrange).bind(redisClient);
    redisClient.llenAsync = promisify(redisClient.llen).bind(redisClient);
    redisClient.lremAsync = promisify(redisClient.lrem).bind(redisClient);
    redisClient.lsetAsync = promisify(redisClient.lset).bind(redisClient);
    redisClient.hmsetAsync = promisify(redisClient.hmset).bind(redisClient);
    redisClient.hmgetAsync = promisify(redisClient.hmget).bind(redisClient);
    redisClient.clear = promisify(redisClient.del).bind(redisClient);
} catch (error) {
    console.log('redis error', error);
}

redisClient.on('connected', function () {
    console.log('Redis is connected');
});
redisClient.on('error', function (error) {
    console.log('Redis error.', error);
});

setInterval(function() {
    console.log('Keeping alive - Performance Test with Redis');
    redisClient.set('ping', 'pong');
}, 1000 * 60 * 4);

redisClient.cacheRoute = (idPrefix, params, serviceMethod) => {
  return new Promise((resolve, reject) => {
    const itemKey = `${idPrefix}:${JSON.stringify(params)}`; // TODO: What about sorting order or params to be consistent?

    console.log('Checking redis key for:', itemKey);
    cache.getAsync(itemKey)
    .then(results => {
      if (results) {
        // console.log('Get results from redis cache!');
        resolve({ data: JSON.parse(results) });
      } else {
        // console.log('Checking service method: ', serviceMethod);
        let newItem = '';
        serviceMethod(params)
        .then(results => {
          newItem = results;
          return cache.setAsync(itemKey, JSON.stringify(newItem));
        })
        .then(cacheResponse => {
          console.log("Cache", cacheResponse);
          resolve({ data: newItem });
        })
        .catch(error => reject(error));
      }
    })
    .catch(error => reject(error));
  });
};

global.cache = redisClient;
module.exports = redisClient;