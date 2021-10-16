'use strict';

// Can swap for http API call here
const { database } = require('./ratingsReviewsDB');

exports.getProductReviews = (productId, page, count, sortBy) => {
  return cache.cacheRoute('productReviews', { productId, page, count, sortBy }, database.getProductReviews);
};

exports.getReviewMetadata = (productId) => {
  return cache.cacheRoute('meta', { productId }, database.getReviewMetadata);
};

exports.getReview = (reviewId) => {
  return cache.cacheRoute('review', { reviewId }, database.getReview);
};

exports.addReview = (reviewClient) => {
  return database.addReview(reviewClient);
  // TODO: Add review to cache as well?
};

exports.markReviewHelpful = (reviewId) => {
  return database.markReviewHelpful(reviewId);
  // TODO: Make helper method to update cache
};

exports.reportReview = (reviewId) => {
  return database.reportReview(reviewId);
  // TODO: Make helper method to update cache
};