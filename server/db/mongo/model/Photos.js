const photoSchema = mongoose.Schema({
  id: { type: Number, required: true },
  url: { type: String, required: true }
});
module.exports.photoSchema = photoSchema;

const Photo = mongoose.model('Photo', photoSchema);
module.exports.Photo = Photo;