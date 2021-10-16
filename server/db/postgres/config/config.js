require('dotenv').config({ path: `${__dirname}/.env` });

const { env } = process;

// === Notes: Logging options
// logging: console.log,                  // Default, displays the first parameter of the log function call
// logging: (...msg) => console.log(msg), // Displays all log function call parameters
// logging: false,                        // Disables logging

module.exports = {
  development: {
    url: env.DEV_DATABASE_URL_POSTGRES,
    database: env.DEV_DATABASE_POSTGRES,
    host: env.HOST_POSTGRES,
    port: env.PORT_POSTGRES,
    username: env.USERNAME_POSTGRES,
    password: env.PASSWORD_POSTGRES,
    dialect: 'postgres',
    logging: false,
    define: {
      freezeTableName: true // Model tableName will be the same as the model name
    },
  },
  test: {
    url: env.TEST_DATABASE_URL_POSTGRES,
    database: env.TEST_DATABASE_POSTGRES,
    host: env.HOST_POSTGRES,
    port: env.PORT_POSTGRES,
    username: env.USERNAME_POSTGRES,
    password: env.PASSWORD_POSTGRES,
    dialect: 'postgres',
    logging: false,
    define: {
      freezeTableName: true // Model tableName will be the same as the model name
    },
  },
  production: {
    url: env.DATABASE_URL_POSTGRES,
    database: env.DATABASE_POSTGRES,
    host: env.HOST_POSTGRES,
    port: env.PORT_POSTGRES,
    username: env.USERNAME_POSTGRES,
    password: env.PASSWORD_POSTGRES,
    dialect: 'postgres',
    logging: false,
    define: {
      freezeTableName: true // Model tableName will be the same as the model name
    },
    pool: {
      max: 400,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
};