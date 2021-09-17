const ReviewInput = require('../../contractObjects/input/ReviewInput.js');
const ProductReviewsRequest = require('../../contractObjects/input/ProductReviewsRequest.js');

const reviewFromServerToDatabase = (reviewServer) => {
  const review = new ReviewInput(reviewServer);
  review.addCharacteristics(reviewServer.characteristics);

  return review;
}
module.exports.reviewFromServerToDatabase = reviewFromServerToDatabase;

const productReviewsRequestFromServerToDatabase = (productId, page, count, sortBy) => {
  return new ProductReviewsRequest(productId, page, count, sortBy);
}
module.exports.productReviewsRequestFromServerToDatabase = productReviewsRequestFromServerToDatabase;