const dbPrimary = require('./mongo');
const dbSecondary = require('./postgre');
// const Promise = require('bluebird');

// This will control requests between server and primary/secondary dabatases.
// This may be turned into a class later with state if that helps with queries.
// If data is kept in sync between databases, then this can also be used for:
//    Falling back to the other database if the first one fails on a query step
//    Making concurrent calls to the DBs and returning whichever one returns first?

// TODO: Improvement: GetReviewsBatch ? Includes metadata in response

const getReviewsByProduct = (productId, page, count, sortBy, filter) => {
  // { product_id: productId }
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
  // { review_id_external: reviewId }
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
  // { product_id: productId }
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

const reportReview = (reviewId) => {
  // { review_id_external: reviewId }
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
  // { review_id_external: reviewId }
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


const sortEnum = {
  newest: 'newest',
  helpful: 'helpful',
  relevant: 'relevant'
}
module.exports.sortEnum = sortEnum;