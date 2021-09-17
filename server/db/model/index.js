const adaptor = require('./adaptor.js');
const dbPrimary = require('../mongo');
const dbSecondary = require('../postgre');

// This will control requests between server and primary/secondary dabatases.
// This may be turned into a class later with state if that helps with queries.
// If data is kept in sync between databases, then this can also be used for:
//    Falling back to the other database if the first one fails on a query step
//    Making concurrent calls to the DBs and returning whichever one returns first?

// TODO: Improvement: GetReviewsBatch ? Includes metadata in response

// ===== FOR ALL METHODS =====
// 1. Receives input contract object needed for db controller based on URL params/query. Other data left raw.
// 2. Completes forming contract object for sending to either DB
// 3. Makes DB request to the appropriate database
// 4. Receives DB request in output contract object and sends it back

const usePrimaryDB = false;
module.exports.usePrimaryDB = usePrimaryDB;

const getProductReviews = (productId, page, count, sortBy) => {
  // { product_id: productId }
  return new Promise( (resolve, reject) => {
    const productReviewRequest = adaptor.productReviewsRequestFromServerToDatabase(productId, page, count, sortBy);
    let filter = undefined; // TODO sort this out, including location of definition

    let db = usePrimaryDB ? dbPrimary.controller : dbSecondary.controller;

    db.getProductReviews(productReviewRequest, filter)
    .then(results => {
      resolve(results);
    })
    .catch(error => {
      console.log('getProductReviews error:', error);
      reject(error);
    })
  });
}
module.exports.getProductReviews = getProductReviews;

const getReview = (reviewId) => {
  // { review_id: reviewId }
  return new Promise( (resolve, reject) => {
    let db = usePrimaryDB ? dbPrimary.controller : dbSecondary.controller;

    db.getReview(reviewId)
    .then(result => {
      resolve(result);
    })
    .catch(error => {
      console.log('getReview error:', error);
      reject(error);
    })
  });
}
module.exports.getReview = getReview;

const getReviewMetadata = (productId) => {
  // { product_id: productId }
  return new Promise( (resolve, reject) => {
    let db = usePrimaryDB ? dbPrimary.controller : dbSecondary.controller;

    db.getReviewMetadata(productId)
    .then(result => {
      resolve(result);
    })
    .catch(error => {
      console.log('getReviewMetadata error:', error);
      reject(error);
    })
  });
}
module.exports.getReviewMetadata = getReviewMetadata;

const reportReview = (reviewId) => {
  // { review_id: reviewId }
  return new Promise( (resolve, reject) => {
    let db = usePrimaryDB ? dbPrimary.controller : dbSecondary.controller;

    db.reportReview(reviewId)
    .then(() => {
      resolve();
    })
    .catch(error => {
      console.log('reportReview error:', error);
      reject(error);
    })
  });
}
module.exports.reportReview = reportReview;

const markReviewHelpful = (reviewId) => {
  // { review_id: reviewId }
  return new Promise( (resolve, reject) => {
    let db = usePrimaryDB ? dbPrimary.controller : dbSecondary.controller;

    db.markReviewHelpful(reviewId)
    .then(() => {
      resolve();
    })
    .catch(error => {
      console.log('markReviewHelpful error:', error);
      reject(error);
    })
  });
}
module.exports.markReviewHelpful = markReviewHelpful;

const addReview = (reviewServer) => {
  return new Promise( (resolve, reject) => {
    const review = adaptor.reviewFromServerToDatabase(reviewServer);
    let db = usePrimaryDB ? dbPrimary.controller : dbSecondary.controller;

    db.addReview(review)
    .then(() => {
      resolve();
    })
    .catch(error => {
      console.log('addReview error:', error);
      reject(error);
    })
  });
}
module.exports.addReview = addReview;

