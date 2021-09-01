const Promise = require('bluebird');

// This will control requests between server model and the associated dabatase.
// This may be turned into a class later with state if that helps with queries.

// ==== Import tables and set up associations ====
const Review = require ('./Reviews.js');
const Product = require ('./Products.js');
Review.hasOne(Product);
Product.belongsTo(Review);

const Profile = require('./Profiles.js');
Review.hasOne(Profile);
Profile.belongsTo(Review);

const Characteristic = require('./Characteristics.js');
Review.belongsToMany(Characteristic, { through: 'review_to_characteristic' });
Characteristic.belongsToMany(Review, { through: 'review_to_characteristic' });

const Photo = require('./Photos.js');
Review.belongsToMany(Photo, { through: 'review_to_photo' });
Photo.belongsToMany(Review, { through: 'review_to_photo' });

const ReviewMetadata = require('./ReviewMetadata.js');


// ===== Create Methods =====
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


