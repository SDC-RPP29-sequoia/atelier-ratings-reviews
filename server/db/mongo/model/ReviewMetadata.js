const characteristicSchema = require('./Characteristics.js');
const ratingSchema = require('./Ratings.js');

const reviewMetadataSchema = mongoose.Schema({
  product_id: { type: Number, required: true },
  ratings: { type: ratingSchema },
  recommended: {
    true: { type: Number },
    false: { type: Number }
  },
  characteristics: [
    { type: characteristicSchema }
  ]
});
const ReviewMetadata = mongoose.model('ReviewMetadata', reviewMetadataSchema);
module.exports.ReviewMetaData = ReviewMetadata;