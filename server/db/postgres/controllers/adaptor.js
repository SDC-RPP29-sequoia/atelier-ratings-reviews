const ProductReview = require('../../../contractObjects/output/ProductReview.js');
const ProductReviews = require('../../../contractObjects/output/ProductReviews.js');
const Review = require('../../../contractObjects/output/Review.js');
const ReviewMetadata = require('../../../contractObjects/output/ReviewMetadata.js');

const productReviewsToOutput = (reviews, productReviewRequest) => {
  const { product_id, page, count } = productReviewRequest;

  const productReviewsOutput = new ProductReviews(product_id, page, count);
  reviews.forEach(review => {
    const reviewOutput = new ProductReview();

    reviewOutput.review_id = review.review_id;
    reviewOutput.rating = review.rating;
    reviewOutput.summary = review.summary;
    reviewOutput.recommend = review.recommend;
    reviewOutput.response = review.response;
    reviewOutput.body = review.body;
    reviewOutput.date = review.date;
    reviewOutput.reviewer_name = review.username;
    reviewOutput.helpfulness = review.helpfulness;

    if (review.photos && review.photos.length > 0) {
      review.photos.forEach(photo => {
        reviewOutput.addPhoto(photo.photo_id, photo.url);
      });
    } else {
      delete reviewOutput.photos;
    }

    productReviewsOutput.results.push(reviewOutput);
  })
  return productReviewsOutput;
}
module.exports.productReviewsToOutput = productReviewsToOutput;

const reviewToOutput = (review) => {
  const reviewOutput = new Review();

  reviewOutput.review_id = review.review_id;
  reviewOutput.product_id = review.product_id;
  reviewOutput.rating = review.rating;
  reviewOutput.summary = review.summary;
  reviewOutput.recommend = review.recommend;
  reviewOutput.response = review.response;
  reviewOutput.body = review.body;
  reviewOutput.date = review.date;
  reviewOutput.reviewer_name = review.username;
  reviewOutput.helpfulness = review.helpfulness;

  if (review.photos && review.photos.length > 0) {
    review.photos.forEach(photo => {
      reviewOutput.addPhoto(photo.photo_id, photo.url);
    });
  } else {
    delete reviewOutput.photos;
  }

  if (review.characteristics && review.characteristics.length > 0) {
    review.characteristics.forEach(characteristic => {
      reviewOutput.addCharacteristic(
        characteristic.characteristic_id,
        characteristic.name,
        characteristic.rating
      );
    });
  } else {
    delete reviewOutput.characteristics;
  }

  return reviewOutput;
}
module.exports.reviewToOutput = reviewToOutput;

const reviewMetadataToOutput = (reviewMetadata) => {
  let reviewMetadataOutput = new ReviewMetadata(reviewMetadata.product_id);
  console.log('reviewMetadata', reviewMetadata);
  console.log('reviewMetadataToOutput', reviewMetadataOutput);

  const propertyObjectHasItems = (objectProperty) => {
    return (objectProperty && Object.keys(objectProperty).length > 0);
  }

  if (reviewMetadata.rating_id) {//(propertyObjectHasItems(reviewMetadataOutput.ratings)) {
    console.log('propertyObjectHasItems: ratings');
    for (let starKey in reviewMetadata.rating) {
      let starComponents = starKey.split('_');
      if (starComponents.length < 2) {
        continue;
      }
      let starValue = starComponents[1];
      reviewMetadataOutput.addRating(starValue, reviewMetadata.rating[starKey]);
    }
  } else {
    console.log('ratings empty');
    reviewMetadataOutput.addRating(0, 1);
  }

  if (reviewMetadata.recommended_id) { //(propertyObjectHasItems(reviewMetadataOutput.recommended)) {
    console.log('propertyObjectHasItems: recommended');
    const recommendedValues = ['true', 'false'];
    recommendedValues.forEach(recommendedValue => {
      if (reviewMetadata.recommended[recommendedValue]) {
        reviewMetadataOutput.addRecommended(
          recommendedValue,
          reviewMetadata.recommended[recommendedValue]
        );
      }
    });
  } else {
    console.log('recommended empty');
    // reviewMetadata.recommended[recommendedValue]
  }

  if (reviewMetadata.characteristics && reviewMetadata.characteristics.length > 0) { //(propertyObjectHasItems(reviewMetadataOutput.characteristics)) {
    console.log('propertyObjectHasItems: characteristics');
    reviewMetadata.characteristics.forEach(characteristic => {
      let totalRatings = 0;
      let totalValue = 0;
      let value = 0;

      if (characteristic.rating) {
        let rating = characteristic.rating;
        for (let starKey in rating) {
          let starComponents = starKey.split('_');
          if (starComponents.length < 2) {
            continue;
          }
          let starValue = parseInt(starComponents[1]);
          if (starValue && rating[starKey]) {
            totalRatings += rating[starKey]
            totalValue += starValue * rating[starKey];
          }
        }
        // TODO: Ratings should be put into form of star: count in adaptor (maybe stars adaptor).
        // TODO: Averages should be determined at highest model level before being passed back to routes
        value = totalRatings > 0 ? parseFloat((totalValue / totalRatings).toFixed(2)) : null;
      } else {
        value = null;
      }

      reviewMetadataOutput.addCharacteristic(
        characteristic.characteristic_id,
        characteristic.name,
        value);
    });
  } else {
    console.log('characteristics empty');
    // reviewMetadataOutput.addCharacteristic(
    //   characteristic.characteristic_id,
    //   characteristic.name,
    //   value);
  }

  console.log('reviewMetadataToOutput', reviewMetadataOutput);
  return reviewMetadataOutput;
}
module.exports.reviewMetadataToOutput = reviewMetadataToOutput;