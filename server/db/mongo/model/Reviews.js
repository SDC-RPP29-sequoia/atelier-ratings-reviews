const characteristicSchema = require('./Characteristics.js');

const reviewSchema = mongoose.Schema({
  review_id_external: { type: Number, required: true },
  product_id: { type: Number, required: true },
  rating: { type: Number, required: true },
  summary: { type: String, required: true },
  body: { type: String, required: true },
  recommend: { type: Boolean, required: true },
  helpfulness: { type: Number },
  reported: { type: Boolean },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  photos: [
   {
    id: { type: Number, required: true }, // May not be required. TBD if this is unique globally vs. in a returned batch
    url: { type: String, required: true }
   }
  ],
  characteristics: [
    { type: characteristicSchema }
  ]
});
const Review = mongoose.model('Review', reviewSchema);
module.exports.Review = Review;