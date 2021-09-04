const ReviewInput = require('../../contractObjects/input/ReviewInput.js');
const ProductReviewsRequest = require('../../contractObjects/input/ProductReviewsRequest.js');

const reviewFromServerToDatabase = (reviewServer) => {
  const review = new ReviewInput(reviewServer);
  review.addCharacteristics(reviewServer.characteristics);

  return review;
}
module.exports.reviewFromServerToDatabase = reviewFromServerToDatabase;

const productReviewsRequestFromServerToDatabase = (productReviewsRequest) => {
  return new ProductReviewsRequest(productReviewsRequest);
}
module.exports.productReviewsRequestFromServerToDatabase = productReviewsRequestFromServerToDatabase;