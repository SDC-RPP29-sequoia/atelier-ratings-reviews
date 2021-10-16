'use strict';

const ratingsReviewsService = require('./ratingsReviewsService');

const {
  sendErrorResponse,
  sendResponse
} = require("../helpers");

exports.getProductReviews = (req, res, next) => {
  const productId = req.query.product_id;
  const page = req.query.page ? req.query.page : 0; // Selects the page of results to return
  const count = req.query.count ? req.query.count : 5; // Specifies how many results per page to return.
  const sortBy = req.query.sort ? req.query.sort : ''; // Changes the sort order of reviews to be based on "newest", "helpful", or "relevant"

  if (productId) {
    ratingsReviewsService.getProductReviews(productId, page, count, sortBy)
    .then(result => sendResponse({ res, responseBody: result.data }))
    .catch(error => sendErrorResponse({ res, statusCode: error.statusCode, message: error.message }))
  } else {
    return sendErrorResponse({res, statusCode: 400, message: 'Product ID missing.'});
  }
};

exports.getReviewMetadata = (req, res, next) => {
  const productId = req.query.product_id;

  if (productId) {
    ratingsReviewsService.getReviewMetadata(productId)
    .then(result => sendResponse({ res, responseBody: result.data }))
    .catch(error => sendErrorResponse({ res, statusCode: error.statusCode, message: error.message }))
  } else {
    return sendErrorResponse({res, statusCode: 400, message: 'Product ID missing.'});
  }
};

exports.getReview = (req, res, next) => {
  const reviewId = req.query.review_id;
  if (reviewId) {
    ratingsReviewsService.getReview(reviewId)
    .then(result => sendResponse({ res, responseBody: result.data }))
    .catch(error => sendErrorResponse({ res, statusCode: error.statusCode, message: error.message }));
  } else {
    return sendErrorResponse({res, statusCode: 400, message: 'Review ID missing.'});
  }
};

exports.addReview = (req, res, next) => {
  let reviewClient = req.body;
  // console.log('req: ', req);
  // console.log('req.body: ', req.body);

  ratingsReviewsService.addReview(reviewClient)
  .then(result => sendResponse({ res, statusCode: 201, responseBody: result.data }))
  .catch(error => sendErrorResponse({ res, statusCode: error.statusCode, message: error.message }))
};

exports.markReviewHelpful = (req, res, next) => {
  const reviewId = req.params.review_id;

  if (reviewId) {
    ratingsReviewsService.markReviewHelpful(reviewId)
    .then(result => sendResponse({ res, statusCode: 204, responseBody: result.data }))
    .catch(error => sendErrorResponse({ res, statusCode: error.statusCode, message: error.message }))
  } else {
    return sendErrorResponse({res, statusCode: 400, message: 'Review ID missing.'});
  }
};

exports.reportReview = (req, res, next) => {
  const reviewId = req.params.review_id;

  if (reviewId) {
    ratingsReviewsService.reportReview(reviewId)
    .then(result => sendResponse({ res, statusCode: 204, responseBody: result.data }))
    .catch(error => sendErrorResponse({ res, statusCode: error.statusCode, message: error.message }))
  } else {
    return sendErrorResponse({res, statusCode: 400, message: 'Review ID missing.'});
  }
};