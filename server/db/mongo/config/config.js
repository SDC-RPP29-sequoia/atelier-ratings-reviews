const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/.env`  });

module.exports = {
  development: {
    url: process.env.DEV_DATABASE_URL_MONGO,
    database: process.env.DEV_DATABASE_MONGO,
    host: process.env.HOST,
    port: process.env.PORT_MONGO,
    username: process.env.USERNAME_MONGO,
    password: process.env.PASSWORD_MONGO,
  },
  test: {
    url: process.env.TEST_DATABASE_URL_MONGO,
    database: process.env.TEST_DATABASE_MONGO,
    host: process.env.HOST,
    port: process.env.PORT_MONGO,
    username: process.env.USERNAME_MONGO,
    password: process.env.PASSWORD_MONGO,
  },
  production: {
    url: process.env.DATABASE_URL_MONGO,
    database: process.env.DATABASE_MONGO,
    host: process.env.HOST,
    port: process.env.PORT_MONGO,
    username: process.env.USERNAME_MONGO,
    password: process.env.PASSWORD_MONGO,
  },
};