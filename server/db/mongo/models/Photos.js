module.exports = (mongoose) => {
  const photos = {};

  photos.schema = mongoose.Schema({
    photo_id: { type: Number, required: true },
    url: { type: String, required: true }
  });

  const modelName = 'Photo';
  photos.model = mongoose.models[modelName] || mongoose.model(modelName, photos.schema);

  return photos;
};

