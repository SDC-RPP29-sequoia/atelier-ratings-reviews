const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/.env`  });

// === Notes: Logging options
// logging: console.log,                  // Default, displays the first parameter of the log function call
// logging: (...msg) => console.log(msg), // Displays all log function call parameters
// logging: false,                        // Disables logging

module.exports = {
  development: {
    url: process.env.DEV_DATABASE_URL_POSTGRES,
    database: process.env.DEV_DATABASE_POSTGRES,
    host: process.env.HOST,
    port: process.env.PORT_POSTGRES,
    username: process.env.USERNAME_POSTGRES,
    password: process.env.PASSWORD_POSTGRES,
    dialect: 'postgres',
    logging: false,conf
    // define: { timestamps: false }
  },
  test: {
    url: process.env.TEST_DATABASE_URL_POSTGRES,
    database: process.env.TEST_DATABASE_POSTGRES,
    host: process.env.HOST,
    port: process.env.PORT_POSTGRES,
    username: process.env.USERNAME_POSTGRES,
    password: process.env.PASSWORD_POSTGRES,
    dialect: 'postgres',
    logging: false,
    // define: { timestamps: false }
    define: {
      freezeTableName: true // Model tableName will be the same as the model name
    },

  },
  production: {
    url: process.env.DATABASE_URL_POSTGRES,
    database: process.env.DATABASE_POSTGRES,
    host: process.env.HOST,
    port: process.env.PORT_POSTGRES,
    username: process.env.USERNAME_POSTGRES,
    password: process.env.PASSWORD_POSTGRES,
    dialect: 'postgres',
    logging: false,
    // define: { timestamps: false }
  },
};