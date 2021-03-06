const mongoose = require('mongoose');
const models = require('../models');
const controllers = require('../controllers');
const reviewsData = require('./ReviewsData.js');
const reviewsMetadataData = require('./ReviewsMetadata.js');

const reSeedDatabase = (database, isProcess=true) => {
  return new Promise((resolve, reject) => {
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
      controllers.eraseDatabaseData()
      .then (() => seedDatabase(models))
      .then (() => {
        console.log('Reseeding of Mongo database complete');
        if (isProcess) {
          process.exit();
        } else {
          resolve();
        }
      })
      .catch ( error => {
        console.log('Unable to reset Mongo database', error);
        if (isProcess) {
          process.exit();
        } else {
          reject();
        }
      });
    })
    .catch ( error => {
      console.error('Unable to initialize the Mongo database:', error);
      reject();
    })
  });;
}

const seedDatabase = (models) => {
  console.log('Seeding Mongo database');
  return new Promise((resolve, reject) => {
    const createReviews = models.Review.create(reviewsData);
    const createReviewsMetadata = models.ReviewMetadata.create(reviewsMetadataData);
    Promise.all([createReviews, createReviewsMetadata])
    .then(() => {
      console.log('Seeded Mongo database');
      resolve();
    })
    .catch(error => {
      console.log('Unable to create Mongo database', error);
      reject();
    });
  });
};

const database = 'ratings_reviews_dev';
reSeedDatabase(database);