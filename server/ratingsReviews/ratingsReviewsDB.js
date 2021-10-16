'use strict';

const { env } = process;

const database = {}

// ==== start ========= from ./model/adaptor.js
const ReviewInput = require('../contractObjects/input/ReviewInput.js');
const ProductReviewsRequest = require('../contractObjects/input/ProductReviewsRequest.js');
// Below is just putting the contents of the adaptor module & import into an object literal here
const adaptor = {
  reviewFromServerToDatabase: (reviewServer) => {
    const review = new ReviewInput(reviewServer);
    review.addCharacteristics(reviewServer.characteristics);

    return review;
  },
  productReviewsRequestFromServerToDatabase: (productId, page, count, sortBy) => {
    return new ProductReviewsRequest(productId, page, count, sortBy);
  }
}
// ==== end ========= from ./model/adaptor.js

// const dbModel = require('./db/model')();
const dbSecondaryInit = require('../db/postgres')();
dbSecondaryInit(() => console.log('Database loaded!'))
.then (dbModel => {
  const db = dbModel.methods;
  console.log('Environment: ', env.NODE_ENV);
  console.log('db:', db);

  // ===== FOR ALL METHODS =====
  // 1. Puts together input contract object needed for db controller based on URL params/query. Other data left raw.
  // 2. Makes DB request
  // 3. Recieves DB request in output contract object and sends it back

  // Returns a list of reviews for a particular product. This list does not include any reported reviews.
  database.getProductReviews = ({ productId, page, count, sortBy }) => {
    return new Promise((resolve, reject) => {
      const productReviewRequest = adaptor.productReviewsRequestFromServerToDatabase(productId, page, count, sortBy);
      // console.log('productReviewRequest: ', productReviewRequest);
      let filter = undefined; // TODO sort this out, including location of definition

      db.getProductReviews(productReviewRequest, filter)
      .then(result => {
        if (result) {
          result.product = productId;
          resolve(result);
        } else {
          let message = `No results were found associated with product_id ${productId}`;
          console.log(message);
          reject({ statusCode: 404, message: message });
        }
      })
      .catch(error => {
        console.log('getProductReviews error:');
        console.log('Server error', error);
        reject({ statusCode: 500, message: error });
      });
    });
  };

  // Returns review metadata for a given product.
  database.getReviewMetadata = ({ productId }) => {
    return new Promise((resolve, reject) => {
      let productIdFilter = { product_id: productId};
      db.getReviewMetadata(productIdFilter)
      .then(result => {
        if (result) {
          // console.log('Result: ', result);
          resolve(result)
        } else {
          let message = `No results were found associated with product_id ${productId}`;
          console.log(message);
          reject({ statusCode: 404, message: message });
        }
      })
      .catch(error => {
        console.log('getReviewMetadata error:', error);
        console.log('Server error', error);
        reject({ statusCode: 500, message: error });
      })
    });
  };

  database.getReview = ({ reviewId }) => {
    return new Promise((resolve, reject) => {
      let reviewIdFilter = { review_id: reviewId};

      db.getReview(reviewIdFilter)
      .then(result => {
        if (result) {
          resolve(result);
        } else {
          let message = `No results were found associated with review_id ${reviewId}`;
          console.log(message);
          reject({ statusCode: 404, message: message });
        }
      })
      .catch(error => {
        console.log('getReview error:');
        console.log('Server error', error);
        reject({ statusCode: 500, message: error });
      });
    });
  };

  // Adds a review for the given product.
  database.addReview = ({ reviewClient }) => {
    return new Promise((resolve, reject) => {
      const review = adaptor.reviewFromServerToDatabase(reviewClient);
      db.addReview(review)
      .then((result) => {
        // console.log('Result: ', result);
        resolve(result)
      })
      .catch(error => {
        console.log('Server error', error);
        reject({ statusCode: 500, message: error });
      });
    });
  };

  // Updates a review to show it was found helpful.
  database.markReviewHelpful = ({ reviewId }) => {
    return new Promise((resolve, reject) => {
      let reviewIdFilter = { review_id: reviewId};
      db.markReviewHelpful(reviewIdFilter)
      .then(() => resolve())
      .catch(error => {
        console.log('Server error', error);
        reject({ statusCode: 500, message: error });
      });
    });
  };

  // Updates a review to show it was reported.
  // Note, this action does not delete the review, but the review will not be returned in the above GET request.
  database.reportReview = ({ reviewId }) => {
    return new Promise((resolve, reject) => {
      let reviewIdFilter = { review_id: reviewId};
      db.reportReview(reviewIdFilter)
      .then(() => resolve())
      .catch(error => {
        console.log('reportReview error:', error);
        console.log('Server error', error);
        reject({ statusCode: 500, message: error });
      });
    });
  };
});

module.exports.database = database;