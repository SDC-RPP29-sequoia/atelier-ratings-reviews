const mongoose = require('mongoose');
const model = require('./model');
const seedDatabase = require('./seed.js');

const database = 'ratings_reviews';

const resetMongo = (callback) => {
  model.eraseDatabaseData()
  .then (() => seedDatabase(model))
  .then (() => callback())
  .catch ( error => console.log('Unable to reset Mongo database', error));
}

const initializeDatabase = (eraseDatabaseOnSync, callback) => {
  mongoose.connect(`mongodb://localhost/${database}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }
  )
  .catch ( error =>
    console.error('Unable to connect to the Mongo database:', error)
  )
  .then ( () => {
    console.log('Connection to Mongo has been established successfully.');
    if (eraseDatabaseOnSync) {
      resetMongo(callback);
    } else {
      callback();
    }
  })
  .catch ( error =>
    console.error('Unable to initialize the Mongo database:', error)
  )
}
module.exports.initializeDatabase = initializeDatabase;

module.exports.model = model;