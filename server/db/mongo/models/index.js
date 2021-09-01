// const db = require('../secondary');
const Promise = require('bluebird');


// ==== Import tables ====
const Characteristic = require('Characteristics.js');
const Review = require('Reviews.js');
const ReviewMetadata = require('ReviewMetadata.js');

// This will control requests between server model and the associated dabatase.
// This may be turned into a class later with state if that helps with queries.

// ===== Create Methods =====
const eraseDatabaseData = () => {
  console.log('Erasing Mongo database data');
  return new Promise ((resolve, reject) => {
    Promise
    .all(
      [
        Characteristic.deleteMany({}),
        Review.deleteMany({}),
        ReviewMetadata.deleteMany({})
      ])
    .then((values) => {
      console.log('Erased all data in Mongo database:', values);
      resolve();
    })
    .catch( error => {
      console.log('Failed to erase all data in Mongo database');
      reject(error);
    });
  })
}
module.exports.eraseDatabaseData = eraseDatabaseData;

const addReview = (review) => {
  return new Promise( (resolve, reject) => {

    // DB call here

    if (error) {
      console.log('addReview error:', error);
      reject(error);
    } else {
      resolve();
    }
  });
}
module.exports.addReview = addReview;

// ===== Read Methods =====
const getReviewsByProduct = (productId, page, count, sortBy, filter) => {
  return new Promise( (resolve, reject) => {
    let results = [];

    // DB call here

    if (error) {
      console.log('getReviewsByProduct error:', error);
      reject(error);
    } else {
      resolve(results);
    }
  });
}
module.exports.getReviewsByProduct = getReviewsByProduct;

const getReview = (reviewId) => {
  return new Promise( (resolve, reject) => {
    let result = {};

    // DB call here

    if (error) {
      console.log('getReview error:', error);
      reject(error);
    } else {
      resolve(result);
    }
  });
}
module.exports.getReview = getReview;

const getReviewMetadata = (reviewId) => {
  return new Promise( (resolve, reject) => {
    let result = {};

    // DB call here

    if (error) {
      console.log('getReviewMetadata error:', error);
      reject(error);
    } else {
      resolve(result);
    }
  });
}
module.exports.getReviewMetadata = getReviewMetadata;

// ===== Update Methods =====
const reportReview = (reviewId) => {
  return new Promise( (resolve, reject) => {

    // DB call here

    if (error) {
      console.log('reportReview error:', error);
      reject(error);
    } else {
      resolve();
    }
  });
}
module.exports.reportReview = reportReview;

const markReviewHelpful = (reviewId) => {
  return new Promise( (resolve, reject) => {

    // DB call here

    if (error) {
      console.log('markReviewHelpful error:', error);
      reject(error);
    } else {
      resolve();
    }
  });
}
module.exports.markReviewHelpful = markReviewHelpful;

const updateMetadata = () => {
  return new Promise( (resolve, reject) => {

    // DB call here

    if (error) {
      console.log('updateMetadata error:', error);
      reject(error);
    } else {
      resolve();
    }
  });
}

// ===== Schemas/Models =====




