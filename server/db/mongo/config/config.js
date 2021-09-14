const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/.env`  });

module.exports = {
  development: {
    // username: process.env.USERNAME,
    // password: process.env.PASSWORD,
    url: process.env.DEV_DATABASE_URL
  },
  test: {
    // username: process.env.USERNAME,
    // password: process.env.PASSWORD,
    url: process.env.TEST_DATABASE_URL
  },
  production: {
    // username: process.env.USERNAME,
    // password: process.env.PASSWORD,
    url: process.env.DATABASE_URL
  },
};