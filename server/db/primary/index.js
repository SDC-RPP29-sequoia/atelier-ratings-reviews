
// const connection = mysql.createConnection({
//   // user: 'student',
//   // password: 'student'
//   user: 'root',
//   password: ''
// });

// const db = Promise.promisifyAll(connection, { multiArgs: true });

// db.connectAsync()
//   .then(() => console.log(`Connected to ${database} database as ID ${db.threadId}`))
//   .then(() => db.queryAsync(`CREATE DATABASE IF NOT EXISTS ${database}`))
//   .then(() => db.queryAsync(`USE ${database}`))
//   .then(() => createTables(db));

// module.exports = db;

// const mysql = require('mysql');
// const createTables = require('./config');
// const Promise = require('bluebird');
// const database = 'ratings_reviews';
const Sequelize = require('sequelize');
const database = 'ratings_reviews';
const user = 'root';
const password = '';

const sequelize = new Sequelize(
  database,
  user,
  password,
  // process.env.DATABASE_USER,
  // process.env.DATABASE_PASSWORD,
  {
    dialect: 'postgres',
  },
);

const models = {
  // User: sequelize.import('./models/user'),
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

module.exports = { sequelize, models };