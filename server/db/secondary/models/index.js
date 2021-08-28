// const db = require('../secondary');
const Promise = require('bluebird');

// This will control requests between server model and the associated dabatase.
// This may be turned into a class later with state if that helps with queries.

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

// ===== Schemas/Models =====
const ratingsReviewsMetadataSchema = mongoose.Schema({
  productId: {type: Number, required: true},
  ratings: {
    0: {type: Number},
    1: {type: Number},
    2: {type: Number},
    3: {type: Number},
    4: {type: Number},
    5: {type: Number},
  },
  recommended: {type: Boolean, required: true},
  characteristics: [
    {type: characteristicSchema}
  ]
});
const RatingsReviewsMetadata = mongoose.model('RatingsReviewsMetadata', ratingsReviewsMetadataSchema);

const reviewSchema = mongoose.Schema({
  product_id: {type: Number, required: true},
  rating: {type: Number, required: true},
  summary: {type: String, required: true},
  body: {type: String, required: true},
  recommend: {type: Boolean, required: true},
  userName: {type: String, required: true},
  userEmail: {type: String, required: true},
  photos: [
   {
    id: {type: Number, required: true}, // May not be required. TBD if this is unique globally vs. in a returned batch
    url: {type: String, required: true}
   }
  ],
  characteristics: [
    {type: characteristicSchema}
  ]
});
const Review = mongoose.model('Review', reviewSchema);

const characteristicSchema = mongoose.Schema({
  id: {type: Number, required: true},
  name: {type: String, required: false},
  value: {type: String, required: false}
});
const Characteristic = mongoose.model('Characteristic', itemSchema);