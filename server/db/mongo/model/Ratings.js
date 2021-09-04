const ratingSchema = mongoose.Schema({
  0: { type: Number },
  1: { type: Number },
  2: { type: Number },
  3: { type: Number },
  4: { type: Number },
  5: { type: Number },
});
module.exports.ratingSchema = ratingSchema;

const Rating = mongoose.model('Rating', ratingSchema);
module.exports.Rating = Rating;