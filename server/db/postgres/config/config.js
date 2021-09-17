const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/.env`  });

module.exports = {
  development: {
    // username: process.env.USERNAME,
    // password: process.env.PASSWORD,
    url: process.env.DEV_DATABASE_URL, //'postgres://127.0.0.1:5432/ratings_reviews_dev', //process.env.DEV_DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    // define: { timestamps: false }
  },
  test: {
    // username: process.env.USERNAME,
    // password: process.env.PASSWORD,
    url: process.env.TEST_DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    // define: { timestamps: false }
  },
  production: {
    // username: process.env.USERNAME,
    // password: process.env.PASSWORD,
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    // define: { timestamps: false }
  },
};