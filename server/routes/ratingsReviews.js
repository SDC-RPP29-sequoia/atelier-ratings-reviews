'use strict';

const router = require('express').Router();

const ratingsReviewsValidator = require('../ratingsReviews/ratingsReviewsValidator');
const ratingsReviewsController = require('../ratingsReviews/ratingsReviewsController');

// https://learn-2.galvanize.com/cohorts/2592/blocks/94/content_files/Front%20End%20Capstone/project-atelier/reviews.md
router.get('/', ratingsReviewsController.getProductReviews);
router.get('/meta', ratingsReviewsController.getReviewMetadata);
router.get('/review', ratingsReviewsController.getReview);

router.post('/', ratingsReviewsValidator.validateReview, ratingsReviewsController.addReview);

router.put('/:review_id/helpful', ratingsReviewsController.markReviewHelpful);
router.put('/:review_id/report', ratingsReviewsController.reportReview);

module.exports = router;