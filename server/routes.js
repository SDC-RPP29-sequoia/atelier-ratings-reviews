const router = require('express').Router();
const dbModel = require('./db/model');

const db = dbModel.methods;

// Authentication
// To use this API, you must create a GitHub API Token and attach it in every request as an "Authorization" header.

// https://learn-2.galvanize.com/cohorts/2592/blocks/94/content_files/Front%20End%20Capstone/project-atelier/reviews.md

// ===== FOR ALL METHODS =====
// 1. Puts together input contract object needed for db controller based on URL params/query. Other data left raw.
// 2. Makes DB request
// 3. Recieves DB request in output contract object and sends it back

// Returns a list of reviews for a particular product. This list does not include any reported reviews.
router.get('/reviews/',
  (req, res) => {
    const productId = req.query.product_id;
    const page = req.query.page ? req.query.page : 1; // Selects the page of results to return
    const count = req.query.count ? req.query.count : 5; // Specifies how many results per page to return.
    const sort = req.query.sort; // Changes the sort order of reviews to be based on "newest", "helpful", or "relevant"

    if (!productId) {
      res.status('400').send('Product ID missing.');
    } else {
      db.getProductReviews(productId, page, count, sort)
      .then(results => {
        const productReviews = {
          product: productId,
          page: page,
          count: count,
          results: results
        };

        res.status('200').send(productReviews);
      })
      .catch(error => {
        console.log('Server error', error);
        res.status('500').send(error);
      });
    }
  });

// Returns review metadata for a given product.
router.get('/reviews/meta',
  (req, res) => {
    const reviewId = req.query.review_id;

    if (!reviewId) {
      res.status('400').send('Review ID missing.');
    } else {
      db.getReviewMetadata(reviewId)
      .then(result => res.status('200').send(result))
      .catch(error => {
        console.log('Server error', error);
        res.status('500').send(error);
      });
    }
  });

// Adds a review for the given product.
router.post('/reviews',
  (req, res) => {

    let review = req.body;

    // Validate required data
    if (!review) {
      res.status('400').send('Review data is missing.');
    } else if (!review.name) {
      res.status('400').send('Reviewer name is missing.');
    } else if (!review.email) {
      res.status('400').send('Reviewer email is missing.');
    } else if (review.rating === undefined && review.recommend === undefined) {
      res.status('400').send('Reviewer rating or recommendation is missing. At least one is needed.');
    }

    db.addReview(review)
    .then(() => res.status('201').send())
    .catch(error => {
      console.log('Server error', error);
      res.status('500').send(error);
    });
  });

// Updates a review to show it was found helpful.
router.put('/reviews/:review_id/helpful',
  (req, res) => {
    const reviewId = req.params.review_id;

    if (!reviewId) {
      res.status('400').send('Review ID missing.');
    } else {
      db.markReviewHelpful(reviewId)
      .then(() => res.status('204').send())
      .catch(error => {
        console.log('Server error', error);
        res.status('500').send(error);
      });
    }
  });

// Updates a review to show it was reported.
// Note, this action does not delete the review, but the review will not be returned in the above GET request.
router.get('/reviews/:review_id/report',
  (req, res) => {
    const reviewId = req.params.review_id;

    if (!reviewId) {
      res.status('400').send('Review ID missing.');
    } else {
      db.reportReview(reviewId)
      .then(() => res.status('204').send())
      .catch(error => {
        console.log('Server error', error);
        res.status('500').send(error);
      });
    }
  });

module.exports = router;