const ratingSchema = require('./Ratings.js');

const characteristicSchema = mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  rating: { type: Number },
  ratings: { type: ratingSchema }
});
module.exports.characteristicSchema = characteristicSchema;

const Characteristic = mongoose.model('Characteristic', characteristicSchema);
module.exports.Characteristic = Characteristic;