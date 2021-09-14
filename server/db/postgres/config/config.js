require('dotenv').config();

module.exports = {
  development: {
    // username: process.env.USERNAME,
    // password: process.env.PASSWORD,
    url: 'postgres://127.0.0.1:5432/ratings_reviews_dev', //process.env.DEV_DATABASE_URL,
    dialect: 'postgres',
  },
  test: {
    // username: process.env.USERNAME,
    // password: process.env.PASSWORD,
    url: process.env.TEST_DATABASE_URL,
    dialect: 'postgres',
  },
  production: {
    // username: process.env.USERNAME,
    // password: process.env.PASSWORD,
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
  },
};