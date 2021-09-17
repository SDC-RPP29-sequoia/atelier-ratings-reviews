const ProductReview = require('../../contractObjects/output/ProductReview.js');
const Review = require('../../contractObjects/output/Review.js');
const ReviewMetadata = require('../../contractObjects/output/ReviewMetadata.js');

const productReviewsToOutput = (reviews) => {
  // TBD: product_id
  const productReviewsOutput = [];
  reviews.forEach(review => {
    const reviewOutput = new ProductReview();

    reviewOutput.review_id = review.review_id;
    reviewOutput.rating = review.rating;
    reviewOutput.summary = review.summary;
    reviewOutput.recommend = review.recommend;
    reviewOutput.response = review.response;
    reviewOutput.body = review.body;
    reviewOutput.date = review.date;
    reviewOutput.reviewer_name = review; // TBD profile_id
    reviewOutput.helpfulness = review.helpfulness;
    reviewOutput.photos = review; // TBD

    productReviewsOutput.push(reviewOutput);
  })
  return productReviewsOutput;
}
module.exports.productReviewsToOutput = productReviewsToOutput;

const reviewToOutput = (review) => {
  // TODO: Finish or remove

  // const Review = sequelize.define('Review', {
  //   review_id: DataTypes.INTEGER, // allowNull: false
  //   product_id: DataTypes.INTEGER, // allowNull: false
  //   profile_id: DataTypes.INTEGER, // allowNull: false
  //   rating: DataTypes.INTEGER, // allowNull: false
  //   summary: DataTypes.STRING, // allowNull: false
  //   recommend: DataTypes.BOOLEAN, // allowNull: false
  //   body: DataTypes.TEXT, // allowNull: false
  //   response: DataTypes.STRING,
  //   date: DataTypes.DATE,
  //   helpfulness: DataTypes.INTEGER,
  //   reported: DataTypes.BOOLEAN,
  // }

  return new Review();
}
module.exports.reviewToOutput = reviewToOutput;

const reviewMetadataToOutput = (reviewMetadata) => {
  let reviewMetadataOutput = new ReviewMetadata(reviewMetadata.productId);

  for (let starKey in reviewMetadata.ratings) {
    let starComponents = starKey.split('_');
    if (starComponents.length < 2) {
      continue;
    }
    let starValue = starComponents[1];
    reviewMetadataOutput.addRating(starValue, reviewMetadata.ratings[starKey]);
  }

  const recommendedValues = ['true', 'false'];
  recommendedValues.forEach(recommendedValue => {
    if (reviewMetadata.recommended[recommendedValue]) {
      reviewMetadataOutput.addRecommended(
        recommendedValue,
        reviewMetadata.recommended[recommendedValue]);
    }
  });

  reviewMetadata.characteristics.forEach(characteristic => {
    let totalRatings = 0;
    let totalValue = 0;
    let ratings = reviewMetadata.characteristics.ratings;
    for (let starKey in ratings) {
      let starComponents = starKey.split('_');
      if (starComponents.length < 2) {
        continue;
      }
      let starValue = starComponents[1];
      totalRatings += ratings[starKey]
      totalValue += starValue * ratings[starKey];
    }
    let value = totalValue / totalRatings;

    reviewMetadataOutput.addCharacteristic(
      characteristic.characteristic_id,
      characteristic.name,
      value);
  });

  return reviewMetadataOutput;
}
module.exports.reviewMetadataToOutput = reviewMetadataToOutput;