const reviewMetadataSchema = mongoose.Schema({
  product_id: {type: Number, required: true},
  count: {type: Number},
  ratings: {
    0: {type: Number},
    1: {type: Number},
    2: {type: Number},
    3: {type: Number},
    4: {type: Number},
    5: {type: Number},
  },
  recommended: {type: Number, required: true},
  characteristics: [
    {type: characteristicSchema}
  ]
});
const ReviewMetadata = mongoose.model('ReviewMetadata', reviewMetadataSchema);
module.exports.ReviewMetaData = ReviewMetadata;