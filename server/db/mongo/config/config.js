require('dotenv').config({ path: `${__dirname}/.env` });

const { env } = process;

module.exports = {
  development: {
    url: env.DEV_DATABASE_URL_MONGO,
    database: env.DEV_DATABASE_MONGO,
    host: env.HOST_MONGO,
    port: env.PORT_MONGO,
    username: env.USERNAME_MONGO,
    password: env.PASSWORD_MONGO,
  },
  test: {
    url: env.TEST_DATABASE_URL_MONGO,
    database: env.TEST_DATABASE_MONGO,
    host: env.HOST_MONGO,
    port: env.PORT_MONGO,
    username: env.USERNAME_MONGO,
    password: env.PASSWORD_MONGO,
  },
  production: {
    url: env.DATABASE_URL_MONGO,
    database: env.DATABASE_MONGO,
    host: env.HOST_MONGO,
    port: env.PORT_MONGO,
    username: env.USERNAME_MONGO,
    password: env.PASSWORD_MONGO,
  },
};