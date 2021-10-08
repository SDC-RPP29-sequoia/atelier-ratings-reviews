const router = require('express').Router();

// ==== start ========= from ./model/adaptor.js
const ReviewInput = require('./contractObjects/input/ReviewInput.js');
const ProductReviewsRequest = require('./contractObjects/input/ProductReviewsRequest.js');
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
const dbSecondaryInit = require('./db/postgres')()
dbSecondaryInit(() => console.log('Database loaded!'))
.then (dbModel => {
  const db = dbModel.methods;
  console.log('Environment: ', process.env.NODE_ENV);
  console.log('db:', db);

  // Authentication
  // To use this API, you must create a GitHub API Token and attach it in every request as an "Authorization" header.

  router.get('/loaderio-820164498ed16bb94bfe6e8106a24b63/', (req, res) => {
    res.sendFile('/atelier-ratings-reviews/server/loaderio-820164498ed16bb94bfe6e8106a24b63.txt')
  });

  // https://learn-2.galvanize.com/cohorts/2592/blocks/94/content_files/Front%20End%20Capstone/project-atelier/reviews.md

  // ===== FOR ALL METHODS =====
  // 1. Puts together input contract object needed for db controller based on URL params/query. Other data left raw.
  // 2. Makes DB request
  // 3. Recieves DB request in output contract object and sends it back

  // Returns a list of reviews for a particular product. This list does not include any reported reviews.
  router.get('/reviews/',
    (req, res) => {
      const productId = req.query.product_id;
      const page = req.query.page ? req.query.page : 0; // Selects the page of results to return
      const count = req.query.count ? req.query.count : 5; // Specifies how many results per page to return.
      const sortBy = req.query.sort ? req.query.sort : ''; // Changes the sort order of reviews to be based on "newest", "helpful", or "relevant"

      if (productId) {
        const productReviewRequest = adaptor.productReviewsRequestFromServerToDatabase(productId, page, count, sortBy);
        console.log('productReviewRequest: ', productReviewRequest);
        let filter = undefined; // TODO sort this out, including location of definition

        db.getProductReviews(productReviewRequest, filter)
        .then(result => {
          if (result) {
            result.product = productId;
            // console.log('Result: ', result);
            res.status('200').send(result);
          } else {
            let message = `No results were found associated with product_id ${productId}`;
            console.log(message);
            res.status('404').send(message);
          }
        })
        .catch(error => {
          console.log('getProductReviews error:');
          console.log('Server error', error);
          res.status('500').send(error);
        });
      } else {
        res.status('400').send('Product ID missing.');
      }
    });

  // Returns review metadata for a given product.
  router.get('/reviews/meta',
    (req, res) => {
      console.log('req.query: ', req.query);
      const productId = req.query.product_id;

      if (productId) {
        let productIdFilter = { product_id: productId};
        db.getReviewMetadata(productIdFilter)
        .then(result => {
          if (result) {
            console.log('Result: ', result);
            res.status('200').send(result)
          } else {
            let message = `No results were found associated with product_id ${productId}`;
            console.log(message);
            res.status('404').send(message);
          }
        })
        .catch(error => {
          console.log('getReviewMetadata error:', error);
          console.log('Server error', error);
          res.status('500').send(error);
        })
      } else {
        res.status('400').send('Review ID missing.');
      }
    });

  router.get('/review/',
    (req, res) => {
      const reviewId = req.query.review_id;
      console.log('req.query: ', req.query);
      if (reviewId) {
        let reviewIdFilter = { review_id: reviewId};

        db.getReview(reviewIdFilter)
        .then(result => {
          if (result) {
            console.log('Result: ', result);
            res.status('200').send(result);
          } else {
            let message = `No results were found associated with review_id ${reviewId}`;
            console.log(message);
            res.status('404').send(message);
          }
        })
        .catch(error => {
          console.log('getReview error:');
          console.log('Server error', error);
          res.status('500').send(error);
        });
      } else {
        res.status('400').send('Review ID missing.');
      }
    });

  // Adds a review for the given product.
  router.post('/reviews',
    (req, res) => {

      let reviewClient = req.body;
      console.log('req: ', req);
      console.log('req.body: ', req.body);

      const validator = {
        message: '',
        isValidReview: (review) => {
          if (!review) {
            this.message = 'Review data is missing.';
            return false;
          } else if (!review.name) {
            this.message = 'Reviewer name is missing.';
            return false;
          } else if (!review.email) {
            this.message = 'Reviewer email is missing.';
            return false;
          } else if (review.rating === undefined && review.recommend === undefined) {
            this.message = 'Reviewer rating or recommendation is missing. At least one is needed.';
            return false;
          } else {
            return true;
          }
        }
      };

      if (validator.isValidReview(reviewClient)) {
        const review = adaptor.reviewFromServerToDatabase(reviewClient);
        db.addReview(review)
        .then((result) => {
          console.log('Result: ', result);
          res.status('201').send(result)
        })
        .catch(error => {
          console.log('Server error', error);
          res.status('500').send(error);
        });
      } else {
        res.status('400').send(validator.message);
      }
    });

  // Updates a review to show it was found helpful.
  router.put('/reviews/:review_id/helpful',
    (req, res) => {
      const reviewId = req.params.review_id;

      if (reviewId) {
        let reviewIdFilter = { review_id: reviewId};
        db.markReviewHelpful(reviewIdFilter)
        .then(() => res.status('204').send())
        .catch(error => {
          console.log('Server error', error);
          res.status('500').send(error);
        });
      } else {
        res.status('400').send('Review ID missing.');
      }
    });

  // Updates a review to show it was reported.
  // Note, this action does not delete the review, but the review will not be returned in the above GET request.
  router.put('/reviews/:review_id/report',
    (req, res) => {
      const reviewId = req.params.review_id;

      if (reviewId) {
        let reviewIdFilter = { review_id: reviewId};
        db.reportReview(reviewIdFilter)
        .then(() => res.status('204').send())
        .catch(error => {
          console.log('reportReview error:', error);
          console.log('Server error', error);
          res.status('500').send(error);
        });
      } else {
        res.status('400').send('Review ID missing.');
      }
    });
})

module.exports = router;